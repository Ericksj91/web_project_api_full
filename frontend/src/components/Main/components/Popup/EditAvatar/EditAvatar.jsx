import { useRef, useContext, useState } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

function EditAvatar(props) {
  const avatarRef = useRef();
  const { isLoading } = useContext(CurrentUserContext);
  const [formValid, setFormValid] = useState(false);
  const [linkError, setLinkError] = useState("");

  function handleLinkChange(e) {
    setFormValid(e.target.form.checkValidity());
    setLinkError(e.target.validationMessage);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({ avatar: avatarRef.current.value });
  }

  return (
    <form
      className="popup__form"
      name="edit-avatar-form"
      id="edit-avatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          name="link"
          id="avatar-link"
          placeholder="Enlace a la imagen"
          type="url"
          required
          ref={avatarRef}
          onChange={handleLinkChange}
        />
        <span
          className={`popup__input-error ${linkError ? "popup__input-error_active" : ""}`}
          id="avatar-link-error"
        >
          {linkError}
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

export default EditAvatar;
