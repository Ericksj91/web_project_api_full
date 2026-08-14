require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { PORT = 3000 } = process.env;
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { validateSignup, validateSignin } = require("./middlewares/validators");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos", err);
  });

app.use(express.json());
app.use(cors());
app.options("*splat", cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
app.post("/signin", validateSignin, login);
app.post("/signup", validateSignup, createUser);
app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("*splat", (req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App esta escuchando el puerto ${PORT}`);
});
