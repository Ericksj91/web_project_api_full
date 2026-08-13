const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    })
    .then((user) => {
      res.json({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de usuario inválido"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => res.status(201).json({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de usuario inválidos"));
      } else if (err.code === 11000) {
        next(new ConflictError("El correo ya está en uso"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    })
    .then((user) => {
      res.json({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de usuario inválido"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de usuario inválidos"));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    })
    .then((user) => {
      res.json({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de usuario inválido"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de usuario inválidos"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || "clave-secreta-desarrollo",
        {
          expiresIn: "7d",
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    })
    .then((user) => {
      res.json({ data: user });
    })
    .catch(next);
};
