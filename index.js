const express = require("express");
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
  res.send("<h1>Hello World!</h1>");
});

server.get("/moi", (req, res) => {
  res.send("<h1>Hello World!</h1>");
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
    res.sendStatus(400);
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

const PORT = 3001;

server.use(requestLogger);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
