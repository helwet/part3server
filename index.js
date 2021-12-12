const express = require("express");
const morgan = require("morgan");
const server = express();
const cors = require("cors");
const _ = require("lodash");
//const path = require("path");
//let rawdata = fs.readFileSync("db.json");
//let db = JSON.parse(rawdata);

//const router = server.router(path.join(__dirname, "db.json"));
//const middlewares = server.defaults();
//server.use(middlewares);
const Person = require("./models/persons");
// Configure morgan to log body of POST request
morgan.token("person", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
});

// json-parser
server.use(express.json());

server.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
server.use(express.static("build"));

server.get("/", (req, res) => {
  res.send("<h1>hello!</h1>");
});

server.get("/moi", (req, res) => {
  res.send("<h1>moi</h1>");
});

server.post("/api/persons", (req, res, next) => {
  console.log("alotetaan");
  if (req.body.name.length < 9 || req.body.number.length < 4) {
    return res
      .status(400)
      .send("name must be longer than 8 and number longer then 3");
  }
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });
  console.log("alotetaan2");
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
server.use(requestLogger);

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).send("bad id");
  }
  next(error);
};

server.use(errorHandler);
const PORT = process.env.password || 3003;

//server.use(requestLogger);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
