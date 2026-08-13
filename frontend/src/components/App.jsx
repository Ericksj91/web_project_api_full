import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
import Register from "./Register/Register";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import * as auth from "../utils/auth";
import api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import RemoveCard from "./Main/components/Popup/RemoveCard/RemoveCard";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [popup, setPopup] = useState(null);
  const [count, setCount] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardDelete, setCardDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({ email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegistration = ({ password, email }) => {
    auth
      .register(password, email)
      .then(() => {
        setIsInfoTooltipOpen(true);
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setIsSuccess(false);
        console.error(err);
      });
  };

  const handleLogin = ({ password, email }) => {
    if (!password || !email) {
      return;
    }
    auth
      .authorize(password, email)
      .then((data) => {
        setToken(data.token);
        return auth.checkToken(data.token);
      })
      .then((userInfo) => {
        setLoginError("");
        setUserData({ email: userInfo.data.email });
        setIsLoggedIn(true);
        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath);
      })
      .catch((err) => {
        setLoginError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
        console.log(err);
      });
  };

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    auth
      .checkToken(jwt)
      .then(({ data }) => {
        setIsLoggedIn(true);
        setUserData({ email: data.email });
      })
      .catch(console.error);
  }, []);

  const removeCardPopup = {
    title: "¿Estás seguro?",
    children: <RemoveCard />,
    className: "popup__content_type_delete",
  };

  function handleRemoveCard(card) {
    setCardDelete(card);
    handleOpenPopup(removeCardPopup);
  }

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleClosePopupInfoTooltip() {
    setIsInfoTooltipOpen(false);
    isSuccess ? navigate("/signin") : null;
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await api
        .getUserInfo()
        .then((userInfo) => {
          setCurrentUser(userInfo);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    })();
  }, []);

  function handleUpdateUser(data) {
    (async () => {
      setIsLoading(true);
      await api
        .updateUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    })();
  }

  function handleUpdateAvatar(link) {
    (async () => {
      setIsLoading(true);
      await api
        .updateUserAvatar(link.avatar)
        .then((newLink) => {
          setCurrentUser(newLink);
          handleClosePopup();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    })();
  }

  useEffect(() => {
    api
      .getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        );
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  }

  async function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    await api
      .addCard(data)
      .then((newCard) => {
        setCards((cards) => [newCard, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          handleUpdateUser,
          handleUpdateAvatar,
          handleAddPlaceSubmit,
          handleCardDelete,
          cardDelete,
          isLoading,
          isLoggedIn,
          setIsLoggedIn,
          userData,
          setLoginError,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="page__content">
                  <Header />
                  <Main
                    onOpen={handleOpenPopup}
                    onClosePopup={handleClosePopup}
                    popup={popup}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleRemoveCard}
                  />
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute anonymous>
                <Register handleRegistration={handleRegistration} />
                {isInfoTooltipOpen && (
                  <InfoTooltip
                    isSuccess={isSuccess}
                    onClose={handleClosePopupInfoTooltip}
                  />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <ProtectedRoute anonymous>
                <Login
                  handleLogin={handleLogin}
                  loginError={loginError}
                  onInputChange={() => setLoginError("")}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
