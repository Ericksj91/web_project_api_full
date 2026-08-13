import { useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

function RemoveCard() {
  const { handleCardDelete, cardDelete } = useContext(CurrentUserContext);

  return (
    <button
      className="button popup__button"
      type="button"
      onClick={() => handleCardDelete(cardDelete)}
    >
      Si
    </button>
  );
}

export default RemoveCard;
