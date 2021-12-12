const miscRouter = require("express").Router();
const Person = require("../models/persons");

//const baseUrl = "http://fhevm.sse.codesandbox.io";

miscRouter.get("/", (req, res) => {
  res.send("<h1>hello!</h1>");
});

miscRouter.get("/moi", (req, res) => {
  res.send("<h1>moi</h1>");
});

miscRouter.get("/info", (req, res) => {
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

module.exports = miscRouter;
