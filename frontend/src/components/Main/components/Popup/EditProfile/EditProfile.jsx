import { useState, useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

function EditProfile(props) {
  const { currentUser, handleUpdateUser, isLoading } =
    useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);
  const [formValid, setFormValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
    setFormValid(e.target.form.checkValidity());
    setNameError(e.target.validationMessage);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setFormValid(e.target.form.checkValidity());
    setDescriptionError(e.target.validationMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateUser({ name, about: description });
  };

  return (
    <form
      className="popup__form"
      name="edit-profile-form"
      id="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_name"
          value={name}
          onChange={handleNameChange}
          name="name"
          id="edit-profile-name"
          placeholder="Nombre"
          type="text"
          required
          minLength="2"
          maxLength="40"
        />
        <span
          className={`popup__input-error ${nameError ? "popup__input-error_active" : ""}`}
        >
          {nameError}
        </span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_description"
          value={description}
          onChange={handleDescriptionChange}
          id="edit-profile-description"
          name="description"
          placeholder="Acerca de mí"
          type="text"
          minLength="2"
          maxLength="200"
          required
        />
        <span
          className={`popup__input-error ${descriptionError ? "popup__input-error_active" : ""}`}
          id="edit-profile-description-error"
        >
          {descriptionError}
        </span>
      </label>
      <button
        className="button popup__button"
        type="submit"
        disabled={!formValid || isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}

export default EditProfile;
