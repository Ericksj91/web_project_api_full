import ImagePopup from "../Popup/ImagePopup/ImagePopup";

function Card(props) {
  const { name, link, isLiked } = props.card;
  const imageComponent = {
    title: "",
    children: <ImagePopup card={props.card} />,
  };

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt=""
        onClick={() => props.onImageClick(imageComponent)}
      />
      <button
        aria-label="Eliminar tarjeta"
        className="card__delete-button"
        type="button"
        onClick={handleDeleteClick}
      ></button>
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Botón Me gusta"
          className={cardLikeButtonClassName}
          type="button"
          onClick={handleLikeClick}
        ></button>
      </div>
    </li>
  );
}

export default Card;
