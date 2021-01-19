const errorHandler = (error, request, response, next) => {
  if (error.name === "URLError") {
    return response.status(error.status).json({
      message: error.message,
      code: error.code,
      status: error.status,
      stack:
        process.env.NODE_ENV === "production"
          ? "The app is in production 🤓"
          : error.stack,
      name: error.name,
    });
    // eslint-disable-next-line no-else-return
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      message: "Invalid JWT Token.",
      code: "INVALID_TOKEN",
      status: 401,
      stack:
        process.env.NODE_ENV === "production"
          ? "The app is in production 🤓"
          : error.stack,
      name: error.name,
    });
  } else {
    return response.status(500).json({
      message: error.message,
      stack:
        process.env.NODE_ENV === "production"
          ? "The app is in production 🤓"
          : error.stack,
      name: error.name,
    });
  }
  // eslint-disable-next-line no-unreachable
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown Endpoint 🤔" });
};

export { errorHandler, unknownEndpoint };
