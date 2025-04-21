import React, { useState } from "react";
import axios from "axios";
import doctorImg from "../assets/doctor-login.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", form);

      localStorage.setItem("token", response.data.token);

      const role = response.data.user.role;
      if (role === "medecin") {
        console.log("Redirecting to /medecin");
        // navigate("/medecin");
      } else if (role === "patient") {
        console.log("Redirecting to /patient");
        // navigate("/patient");
      } else {
        console.log("Unknown role, redirecting to /");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "Email ou mot de passe incorrect.");
      } else {
        setError("Erreur de connexion au serveur.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 to-orange-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Login Image Section */}
        <div className="hidden md:flex flex-1 bg-white items-center justify-center p-6 md:p-8">
          <img src={doctorImg} alt="Doctor" className="max-w-full h-auto max-h-96" />
        </div>

        {/* Login Form Section */}
        <div className="flex-1 p-6 md:p-10 text-center">
          <h1 className="text-base sm:text-lg md:text-xl mb-4 text-gray-700">🩺 Bienvenue sur RVmedical !</h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">Connexion</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="text-left text-gray-600 text-sm sm:text-base">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Entrer votre email"
              value={form.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label className="text-left text-gray-600 text-sm sm:text-base">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="Entrer votre mot de passe"
              value={form.password}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>

            {error && <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;