class URLError extends Error {
  constructor(code = "NULL", status = "500", ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, URIError);
    }
    this.name = "URLError";
    this.code = code;
    this.status = status;
  }
}

export default URLError;
