const express = require("express");
const morgan = require("morgan");
const server = express();
//const path = require("path");
//const db = path.join(__dirname, "db.json");
const fs = require("fs");
let rawdata = fs.readFileSync("db.json");
let db = JSON.parse(rawdata);

const _ = require("lodash");
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
server.get("/persons", (req, res) => {
  res.send.json(db);
});
server.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  db = db.filter((person) => person.id !== id);
  res.status(204).end();
});

server.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = db.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
server.get("/info", (req, res) => {
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
});

server.post("/api/persons", (req, res) => {
  //const db = router.db; // Assign the lowdb instance
  var addedCounter = 0;

  //if number not found already add
  if (Array.isArray(req.body)) {
    req.body.forEach((element) => {
      if (
        typeof db.numbers.number.find((num) => num === element.number) ===
          undefined &&
        typeof db.numbers.name.find((name) => name === element.name) ===
          undefined
      ) {
        var toAdd =
          `{
              "id" : ` +
          generateID() +
          ` ,
              "name" : ` +
          element.name +
          ` ,
              "number" : ` +
          element.number +
          ` ,
              }`;
        insert(db, "numbers", toAdd); // Add a post
        addedCounter++;
      }
    });
  } else {
    if (
      typeof db.numbers.number.find((num) => num === req.body.number) ===
        undefined &&
      typeof db.numbers.name.find((name) => name === req.body.name) ===
        undefined
    ) {
      var toAdd =
        `{
          "id" : ` +
        generateID() +
        ` ,
          "name" : ` +
        req.body.name +
        ` ,
          "number" : ` +
        req.body.number +
        ` ,
          }`;
      insert(db, "numbers", toAdd); // Add a post
      addedCounter++;
    }
  }
  if (addedCounter === 0) {
    res.status(400);
    res.send("name and number need to be unique");
  }

  res.body = "added: " + addedCounter + " new numbers";
  res.sendStatus(200);

  function generateID() {
    //const db = router.db;
    const maxId =
      db.numbers.length > 0 ? Math.max(...db.numbers.map((n) => n.id)) : 0;
    return maxId + 1;
  }
  /**
   * Checks whether the id of the new data already exists in the DB
   * @param {*} db - DB object
   * @param {String} collection - Name of the array / collection in the DB / JSON file
   * @param {*} data - New record
   */
  function insert(db, collection, data) {
    const table = db.get(collection);
    if (_.isEmpty(table.find(data).value())) {
      table.push(data).write();
    }
  }
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

morgan.token("body", (req, res) => JSON.stringify(req.body));
server.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);
const PORT = 3001;

//server.use(requestLogger);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
