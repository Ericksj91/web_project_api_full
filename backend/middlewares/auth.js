const jwt = require("jsonwebtoken");
const ForbiddenError = require("../errors/forbidden-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ForbiddenError("Se requiere autorización"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave-secreta-desarrollo",
    );
  } catch (err) {
    return next(new ForbiddenError("Se requiere autorización"));
  }

  req.user = payload;

  next();
};
