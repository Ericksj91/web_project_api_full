module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
};
