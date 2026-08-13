function ImagePopup(props) {
  const { name, link } = props.card;

  return (
    <>
      <img alt="" className="popup__image" src={link} />
      <p className="popup__caption">{name}</p>
    </>
  );
}

export default ImagePopup;
