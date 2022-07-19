import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);

  //creamos una variable de estado para meter allí los valores de los logIn's
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const goToProfile = () => {
    navigate("/privada");
  };
  return (
    <>
      {store.permiso == true ? (
        goToProfile()
      ) : (
        <div className="text-center mt-5">
          <div className="d-flex justify-content-center" id="caja">
            <div
              className="card bg-transparent bg-gradient"
              style={{ width: "28rem", height: "35rem" }}
            >
              <div className="card-body">
                <h5 className="card-title my-4">
                  <i
                    className="fas fa-user-circle fa-4x"
                    style={{ color: "mistyrose" }}
                  ></i>
                </h5>
                <div className="d-flex flex-column mx-4">
                  <form onSubmit={handleSubmit}>
                    <div className="d-flex">
                      <i
                        className="far fa-user fa-lg me-2 mt-4"
                        style={{ color: "mistyrose" }}
                      ></i>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control bg-transparent border-0 border-bottom mt-3"
                        placeholder="Username"
                        type={"email"}
                      ></input>
                    </div>
                    <div className="d-flex">
                      <i
                        className="fa fa-lock fa-lg me-2 mt-4"
                        style={{ color: "mistyrose" }}
                      ></i>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control bg-transparent border-0 border-bottom mt-3"
                        placeholder="Password"
                        type={"password"}
                      ></input>
                    </div>
                  </form>
                </div>
                <div className="mt-4">
                  {localStorage.getItem("token") ? (
                    <></>
                  ) : (
                    <>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          let results = actions.login(email, password);
                          if (results == true) {
                            goToProfile();
                          }
                        }}
                        className="btn btn-danger btn-lg my-4 px-5"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
                <div className="mb-4">
                  Don't have an account?{" "}
                  <Link to="/demo">
                    <span
                      href="#"
                      className="card-link text-white fw-bold text-decoration-none"
                    >
                      Sign up
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
