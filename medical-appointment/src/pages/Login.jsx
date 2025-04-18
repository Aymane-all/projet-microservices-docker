import React from "react";
import "./Login.css";
import doctorImg from "../assets/doctor-login.png";

function Login() {
  return (
    <div className="login-page">
      <div className="login-image">
        <img src={doctorImg} alt="Doctor" />
      </div>

      <div className="login-container">
        <h1 className="login-quote">🩺 Bienvenue sur RVmedical !</h1>
        <h2>Connexion</h2>
        <form className="login-form">
          <label>Email</label>
          <input type="email" placeholder="Entrer votre email" />
          <label>Mot de passe</label>
          <input type="password" placeholder="Entrer votre mot de passe" />
          <button>Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
