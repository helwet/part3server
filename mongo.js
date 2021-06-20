const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync("secrets.json"));
const password = secrets.dbpassword;
const username = secrets.dbuser;
const url = `mongodb+srv:${username}:${password}//cluster0.ojph5.mongodb.net/myFirstDatabase`;

const mongoose = require("mongoose");

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "Teppo Tulppu",
  number: "123 1212 123",
  id: 1
});

person.save().then((response) => {
  console.log("person saved!");
  mongoose.connection.close();
});
