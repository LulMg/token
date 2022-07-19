"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
import datetime #nos ayuda a trabajar con fecha y hora (nos puede ayudar a definir el tiempo en el que expiran los tokens)
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
#from models import Person

ENV = os.getenv("FLASK_ENV")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

#iniciar JWT
jwt = JWTManager(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# registro de nuevo usuario

@app.route('/signup', methods=['POST'])
def signup():
    request_body = request.get_json() #el request.json() se utiliza para poder recibir datos de mi api
    user = User.query.filter_by(email = request_body['email']).first()
    if user:
        return jsonify({'mensaje': 'este usuario ya existe'})
    else:
        nuevo_usu = User(email = request_body['email'], password = request_body['password'], name = request_body['name'], is_active = True)
        db.session.add(nuevo_usu)
        db.session.commit()
        return jsonify(request_body,{'mensaje':'tu usuario ha sido registrado con exito'}),200

#inicio de sesion

@app.route('/login', methods=['POST'])
def iniciar_sesion():
    request_body = request.get_json()
    print(request_body)
    user = User.query.filter_by(email = request_body['email']).first()
    if user:
        if user.password == request_body['password']:
            tiempo = datetime.timedelta(minutes=60) #definimos el tiempo de durabilidad del token 
            #create_access_token(quienSoy, PorcuantoTiempo)
            acceso = create_access_token(identity=request_body['email'], expires_delta=tiempo)
            return jsonify({
            'mensaje': 'inicio de sesión exitoso',
            'duracion': tiempo.total_seconds(),
            'token': acceso
            }) 
        else:
            return jsonify({"error": "contraseña incorrecta"})
    else:
        return jsonify({"error": "no existe un usuario registrado con esos datos"}), 400



#crear ruta privada a la que no calquiera puede ingresar para hacer el signUp (esta ruta necesita del token)

@app.route('/privada', methods=['GET'])
@jwt_required() #se encarga de hacer todas las validaciones necesarias
def privada():
    identidad = get_jwt_identity()
    return jsonify(
            {'acceso':'concedido',
            'permiso': True,
            'email': identidad,
             'mensaje': 'acceso exitoso'})


# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
