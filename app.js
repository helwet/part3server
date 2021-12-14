const express = require("express");
const server = express();
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
//const path = require("path");
//let rawdata = fs.readFileSync("db.json");
//let db = JSON.parse(rawdata);
const personsRouter = require("./controllers/persons");
const miscRouter = require("./controllers/misc");

/*
  morgan.token('resBody', (req, res) => res.resBody);
  res.send = (...args) => {
      res.oldsend(...args);
      res.resBody = JSON.stringify(args);
  };
  */
server.use(
  morgan(
    ":status [:method :url] lenght :res[content-length] :person - :response-time ms "
  )
);
// Configure morgan to log body of POST request
morgan.token("person", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
});

server.use(cors({ origin: true }));
console.log("ok1");
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
server.use(requestLogger);
server.use(express.static("build"));
server.use(express.json());
server.use(personsRouter);
server.use(miscRouter);
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (process.env.NODE_ENV !== "test") {
    if (error.name === "CastError") {
      return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
      return response.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
      return response.status(401).json({
        error: "invalid token"
      });
    } else if (error.name === "TokenExpiredError") {
      return response.status(401).json({ error: "token expired" });
    }
  }
  next(error);
};
server.use(unknownEndpoint);
server.use(errorHandler);

console.log("ok1");

module.exports = server;
