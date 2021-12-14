const miscRouter = require("express").Router();
const Person = require("../models/persons");

//const baseUrl = "http://fhevm.sse.codesandbox.io";

miscRouter.get("/", (req, res) => {
  res.send("hello!");
});

miscRouter.get("/moi", (req, res) => {
  res.send("moi");
});

miscRouter.get("/info", async (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = "server time is: " + date + " " + time + "";
  //const db = router.db;
  console.log("getting info");
  const blogs = await Person.find({});
  console.log(blogs);
  var firstLine = "phonebook contains: " + blogs.length + " numbers";
  res.send(firstLine + dateTime);
});

module.exports = miscRouter;
