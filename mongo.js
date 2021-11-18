const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync("secrets.json"));
const password = secrets.dbpassword;
const username = secrets.dbuser;
const url = `mongodb+srv://puhelinluettelo:${password}@cluster0.ojph5.mongodb.net/puh?retryWrites=true&w=majority`;

console.log(url);

//const url = `mongodb+srv://cluster0.ojph5.mongodb.net/myFirstDatabase" --username ${username} --password${password}`;
const mongoose = require("mongoose");
//const AutoIncrement = require("mongoose-sequence")(mongoose);
//const uniqueValidator = require("mongoose-unique-validator");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);
