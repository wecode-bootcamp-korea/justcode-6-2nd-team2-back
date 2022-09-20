class BaseError extends Error {
  constructor(message, httpStatusCode) {
    super(message);

    this.message = message;
    this.statusCode = httpStatusCode;

    this.date = new Date();

    Error.captureStackTrace(this);
  }
}

module.exports = { BaseError };

// asyncUtil(async (req, res, next) => {
//   const collections = await collection.find().populate('other'); // you can do try/catch here if you want to handle the error here
//   res.send(collections);
