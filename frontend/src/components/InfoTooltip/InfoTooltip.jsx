import close from "../../images/close.svg";
import successIcon from "../../images/successIcon.svg";
import errorIcon from "../../images/errorIcon.svg";

function InfoTooltip(props) {
  const { isSuccess, onClose } = props;

  return (
    <div className="popup">
      <div className="popup__container">
        <button
          aria-label="Cerrar ventana emergente"
          className="popup__close"
          type="button"
          onClick={onClose}
        >
          <img alt="Logotipo para cerrar imagen" src={close} />
        </button>
        <img
          className="popup__status"
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Registro exitoso" : "Error en el registro"}
        />
        <h2 className="popup__message">
          {isSuccess
            ? "¡Correcto! Ya estás registrado."
            : "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
