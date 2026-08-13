import { useRef, useContext, useState } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

function NewCard(props) {
  const { handleAddPlaceSubmit, isLoading } = useContext(CurrentUserContext);
  const nameRef = useRef();
  const linkRef = useRef();
  const [formValid, setFormValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [linkError, setLinkError] = useState("");

  function handleNameChange(e) {
    setFormValid(e.target.form.checkValidity());
    setNameError(e.target.validationMessage);
  }

  function handleLinkChange(e) {
    setFormValid(e.target.form.checkValidity());
    setLinkError(e.target.validationMessage);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleAddPlaceSubmit({
      name: nameRef.current.value,
      link: linkRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      name="card-form"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_card-name"
          name="name"
          id="card_name"
          placeholder="Título"
          minLength="2"
          maxLength="30"
          type="text"
          required
          ref={nameRef}
          onChange={handleNameChange}
        />
        <span
          className={`popup__input-error ${nameError ? "popup__input-error_active" : ""}`}
        >
          {nameError}
        </span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          name="link"
          id="card-link"
          placeholder="Enlace a la imagen"
          type="url"
          required
          ref={linkRef}
          onChange={handleLinkChange}
        />
        <span
          className={`popup__input-error ${linkError ? "popup__input-error_active" : ""}`}
        >
          {linkError}
        </span>
      </label>
      <button
        className="button popup__button"
        type="submit"
        disabled={!formValid || isLoading}
      >
        {isLoading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}

export default NewCard;
