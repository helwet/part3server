const express = require('express')
const server = express()
const morgan = require('morgan')
const cors = require('cors')
const _ = require("lodash");
const Person = require('./models/persons')
//const path = require("path");
//const db = path.join(__dirname, "db.json");
//const fs = require("fs");
//let rawdata = fs.readFileSync("db.json");
//let db = JSON.parse(rawdata);

//const router = server.router(path.join(__dirname, "db.json"));
//const middlewares = server.defaults();
//server.use(middlewares);
server.use(express.json());
//server.use(router);

server.get("/", (req, res) => {
  res.send("<h1>hello!</h1>");
});

server.get("/moi", (req, res) => {
  res.send("<h1>moi</h1>");
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person',
  ),
)

app.get('/info', (req, res) => {

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = "<div> server time is: " + date + " " + time + "</div>";
  //const db = router.db;
  var firstLine =
    "<div>phonebook contains: " + db.numbers.length + " numbers</div>";
  res.send(firstLine + dateTime);
  var count = 0
  Person.find({})
    .then((persons) => {
       count = persons.length
    });
  res.send(firstLine + dateTime);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id).then((person) => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    }).catch((error) => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req

  // Error handling
  if (req.body.name.length < 8 || reg.body.number.length < 3) {
    return res.status(400).json({
      error: 'name is required',
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON())
    })
    .catch((error) => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req
  const { id } = req.params

  const person = {
    name: body.name,
    number: body.number,
  }

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

server.use(errorHandler)




const PORT = 3001;

//server.use(requestLogger);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})