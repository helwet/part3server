const password = "puhpah";
const username = "puhelinluottelo";
const url = `mongodb+srv:${username}:${password}//cluster0.ojph5.mongodb.net/myFirstDatabase`;

const mongoose = require("mongoose");

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const personSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  content: "HTML is Easy",
  date: new Date(),
  important: true
});

person.save().then((response) => {
  console.log("person saved!");
  mongoose.connection.close();
});
