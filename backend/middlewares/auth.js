const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Se requiere autorización" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave-secreta-desarrollo",
    );
  } catch (err) {
    return res.status(403).json({ message: "Se requiere autorización" });
  }

  req.user = payload;

  next();
};
