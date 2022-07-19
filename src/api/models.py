from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):  #el (db.Model) es para poder identificar que voy a trabajar con sqlalquemy
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), unique= False, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    #nullable es si el campo puede ser nulo o no (pe... nulo podría ser el color del pelo)
    
    def __repr__(self): #repr (representation): identifica cada registro del usuario por el email
        return f'<User {self.email}>'

    def serialize(self): #me va a ayudar a conseguir todos los valores que quiera mostrar e la tabla
        return {
            "id": self.id,
            "email": self.email,
            "name" : self.name,
            # do not serialize the password, its a security breach
        }