const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");
const _ = require("lodash");
//const path = require("path");
//const db = path.join(__dirname, "db.json");
//const fs = require("fs");
//let rawdata = fs.readFileSync("db.json");
//let db = JSON.parse(rawdata);

//const router = server.router(path.join(__dirname, "db.json"));
//const middlewares = server.defaults();
//server.use(middlewares);

server.use(cors);
server.use(express.json());
const Person = require("./models/persons");
//server.use(router);

server.get("/", (req, res) => {
  res.send("<h1>hello!</h1>");
});

server.get("/moi", (req, res) => {
  res.send("<h1>moi</h1>");
});

server.post("/api/persons", (req, res, next) => {
  if (req.body.name.length < 9 || req.body.number.length < 4) {
    return res
      .status(400)
      .message("name must be longer than 8 and number longer then 3");
  }
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((error) => next(error));
});

server.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(req.params, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

server.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()));
  });
});

server.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

server.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

server.get("/info", (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = "<div> server time is: " + date + " " + time + "</div>";
  //const db = router.db;

  res.send(firstLine + dateTime);
  var count = 0;
  Person.find({}).then((persons) => {
    count = persons.length;
  });
  var firstLine = "<div>phonebook contains: " + count + " numbers</div>";
  res.send(firstLine + dateTime);
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).message("bad id");
  }
  next(error);
};

server.use(errorHandler);
const PORT = 3001;

//server.use(requestLogger);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
