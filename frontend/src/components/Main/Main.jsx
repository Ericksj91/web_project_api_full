//import avatar from "../../images/avatar.jpg";
import { useEffect, useState, useContext } from "react";
import Popup from "./components/Popup/Popup";
import EditAvatar from "./components/Popup/EditAvatar/EditAvatar";
import EditProfile from "./components/Popup/EditProfile/EditProfile";
import NewCard from "./components/Popup/NewCard/NewCard";
import Card from "./components/Card/Card";
import ImagePopup from "./components/Popup/ImagePopup/ImagePopup";
import api from "../../utils/api";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function Main(props) {
  const { currentUser, handleUpdateUser, handleUpdateAvatar } =
    useContext(CurrentUserContext);
  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard />,
  };
  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar onUpdateAvatar={handleUpdateAvatar} />,
    className: "popup__content_type_avatar",
  };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile />,
  };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__avatar-container">
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt="Avatar"
          />
          <button
            className="profile__avatar-edit-button"
            type="button"
            onClick={() => props.onOpen(editAvatarPopup)}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => props.onOpen(editProfilePopup)}
          ></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={() => props.onOpen(newCardPopup)}
        ></button>
      </section>
      <section className="cards page__section">
        <ul className="cards__list">
          {props.cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onImageClick={props.onOpen}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
      {props.popup && (
        <Popup
          onClose={props.onClosePopup}
          title={props.popup.title}
          className={props.popup.className}
        >
          {props.popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
