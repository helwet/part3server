const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync("secrets.json"));
const password = secrets.dbpassword;
const username = secrets.dbuser;
const url = `mongodb+srv://${username}:${password}@cluster0.ojph5.mongodb.net`;

console.log(url);

//const url = `mongodb+srv://cluster0.ojph5.mongodb.net/myFirstDatabase" --username ${username} --password${password}`;
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const uniqueValidator = require("mongoose-unique-validator");

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
personSchema.plugin(AutoIncrement, { inc_field: "id" });
personSchema.plugin(uniqueValidator);

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[0],
  number: process.argv[1],
  id: 1
});

person.save().then((response) => {
  console.log("person saved!");
  mongoose.connection.close();
});
