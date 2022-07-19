import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

const handleSubmit = (e) => {
  e.preventDefault();
};

export const Demo = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rPassword, setRpassword] = useState("");
  const [uName, setUname] = useState("");

  return (
    <div className="container mt-4">
      <h1 className="display-4 text-center text-light fw-bold">
        Personal data record
      </h1>
      <div className="bg-dark bg-opacity-50 mt-5 p-4 mb-4 text-light">
        <form className="mt-3 px-5" onSubmit={handleSubmit}>
          <div className="form-group my-2">
            <label>Email address</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              className="form-control my-2"
              placeholder="something@something_else.com"
            />
            <small id="emailHelp" className="form-text text-dark">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group d-flex">
            <div className="col-6">
              <label>Name</label>
              <input
                onChange={(e) => {
                  setUname(e.target.value);
                }}
                type="text"
                className="form-control my-2"
                id="text"
                placeholder="Name"
              />
            </div>
            <div className="col ms-4">
              <label>Age</label>
              <input
                type={"number"}
                min={"13"}
                max={"100"}
                className="form-control my-2"
                id="int"
                placeholder="Your age"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={"password"}
              className="form-control my-2"
              id="Password"
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <label>Repeat password</label>
            <input
              onChange={(e) => {
                setRpassword(e.target.value);
              }}
              type={"password"}
              className="form-control my-2"
              id="pss"
              placeholder="Repeat your password"
            />
          </div>
          <button
            onClick={() => {
              if (password == rPassword) {
                actions.signup(uName, email, password);
              } else {
                alert("Las contraseñas no coinciden");
              }
            }}
            type="submit"
            className="btn btn-danger btn-lg mt-4 col-12"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="text-center">
        <Link to="/">
          <button className="btn btn-dark btn-lg">Click here to SIGN IN</button>
        </Link>
      </div>
    </div>
  );
};
