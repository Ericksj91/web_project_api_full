const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  /*console.log(req.user._id);*/

  Card.create({ name, link, owner })
    .then((card) => res.status(201).json({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de tarjeta inválidos"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError("Se requiere autorización"));
      }
      return card.deleteOne().then(() => {
        res.json({ message: "Tarjeta eliminada correctamente" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de tarjeta inválido"));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de tarjeta inválido"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de tarjeta inválido"));
      } else {
        next(err);
      }
    });
};
