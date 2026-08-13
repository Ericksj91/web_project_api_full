const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Explorador",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/300",
    validate: {
      validator: function (v) {
        return /https?:\/\/(www\.)?[a-z0-9.-]+[\w._~:/?%#\[\]@!$&'()*+,;=]*/i.test(
          v,
        );
      },
      message: (props) => `${props.value} no es una URL válida!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Correo electrónico inválido",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Correo o contraseñas incorrectas"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Correo o contraseñas incorrectas"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
