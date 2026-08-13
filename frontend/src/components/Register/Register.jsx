import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../images/logo.svg";

const Register = ({ handleRegistration }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(data);
  };

  return (
    <div className="register page__content">
      <div className="register__header page__section">
        <img
          alt="Logotipo Around The U.S."
          className=" register__header-logo"
          src={logo}
        />
        <Link to="/signin" className="register__header-title">
          Iniciar sesión
        </Link>
      </div>
      <div className="register__content page section">
        <p className="register__welcome">Regístrate</p>
        <form className="register__form" onSubmit={handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
          ></input>
          <input
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Contraseña"
          ></input>
          <button type="submit" className="register__button">
            Regístrate
          </button>
        </form>
        <div className="register__signup">
          <span>¿Ya eres miembro?</span>
          <Link to="/signin" className="register__signup-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
