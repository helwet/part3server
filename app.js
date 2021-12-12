const express = require("express");
const mongoose = require("mongoose");
const server = express();
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const _ = require("lodash");
//const path = require("path");
//let rawdata = fs.readFileSync("db.json");
//let db = JSON.parse(rawdata);
const personsRouter = require("./controllers/persons");
const miscRouter = require("./controllers/misc");

const url = `mongodb+srv://puhelinluettelo:${process.env.password}@cluster0.ojph5.mongodb.net/puh?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });
// Configure morgan to log body of POST request
morgan.token("person", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
});
server.use(cors());
server.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
console.log("ok1");

server.use(express.static("build"));
server.use(express.json());
server.use(personsRouter);
server.use(miscRouter);

console.log("ok1");
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
server.use(requestLogger);

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).send("bad id");
  }
  next(error);
};

server.use(errorHandler);

console.log("ok1");

module.exports = server;
