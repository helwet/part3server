const miscRouter = require("express").Router();
const Person = require("../models/persons");

//const baseUrl = "http://fhevm.sse.codesandbox.io";

miscRouter.get("/", (req, res) => {
  res.send("hello!");
});

miscRouter.get("/moi", (req, res) => {
  res.send("moi");
});

miscRouter.get("/info", (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = "server time is: " + date + " " + time + "";
  //const db = router.db;

  var count = 0;
  Person.find({}).then((persons) => {
    count = persons.length;
  });
  var firstLine = "\\nphonebook contains: " + count + " numbers";
  res.send(firstLine + dateTime);
});

module.exports = miscRouter;
