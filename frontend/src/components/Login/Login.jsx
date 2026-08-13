import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../images/logo.svg";

const Login = ({ handleLogin, loginError, onInputChange }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    onInputChange();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(data);
  };

  return (
    <div className="login page__content">
      <div className="login__header page__section">
        <img
          alt="Logotipo Around The U.S."
          className=" login__header-logo"
          src={logo}
        />
        <Link
          to="/signup"
          className="login__header-title"
          onClick={onInputChange}
        >
          Regístrate
        </Link>
      </div>
      <div className="login__content page section">
        <p className="login__welcome">Incia sesión</p>
        {loginError && <p className="login__error">{loginError}</p>}
        <form className="login__form" onSubmit={handleSubmit}>
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
          <button type="submit" className="login__button">
            Inicia Sesión
          </button>
        </form>
        <div className="login__signin">
          <span>¿Ya eres miembro?</span>
          <Link to="/signup" className="login__signin-link">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
