import close from "../../../../images/close.svg";

export default function Popup(props) {
  const { onClose, title, children, className } = props;
  return (
    <div className="popup">
      <div
        className={`popup__content ${className || (!title ? "popup__content_type_image" : "")}`}
      >
        <button
          aria-label="Cerrar ventana emergente"
          className="popup__close"
          type="button"
          onClick={onClose}
        >
          <img alt="Logotipo para cerrar imagen" src={close} />
        </button>
        <h3 className="popup__title">{title}</h3>
        {children}
      </div>
    </div>
  );
}
