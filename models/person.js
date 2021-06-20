const secrets = JSON.parse("../secrets.json");
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
  id: Number,
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  id: 1,
  name: "pekka pouta",
  number: "123-00 00 000"
});

person.save().then((response) => {
  console.log("person saved!");
  mongoose.connection.close();
});
