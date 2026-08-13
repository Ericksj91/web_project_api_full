import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/token";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import logo from "../../images/logo.svg";
import menu from "../../images/menu.svg";
import close from "../../images/close.svg";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, setIsLoggedIn, setLoginError } =
    useContext(CurrentUserContext);

  const navigate = useNavigate();

  function signOut() {
    removeToken();
    navigate("/signin");
    setIsLoggedIn(false);
    setLoginError("");
  }

  return (
    <>
      {menuOpen && (
        <div className="header__mobile-menu">
          <p className="header__email">{userData.email}</p>
          <button onClick={signOut} className="header__logout">
            Cerrar sesión
          </button>
        </div>
      )}
      <header className="header page__section">
        <img
          alt="Logotipo Around The U.S."
          className="logo header__logo"
          src={logo}
        />
        <div className="header__user">
          <p className="header__email">{userData.email}</p>
          <button onClick={signOut} className="header__logout">
            Cerrar sesión
          </button>
        </div>
        <button
          className="header__burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            className="header__burger-icon"
            src={menuOpen ? close : menu}
            alt="Menú"
          />
        </button>
      </header>
    </>
  );
}

export default Header;
