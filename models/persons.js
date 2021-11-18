const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync("secrets.json"));
const password = secrets.dbpassword;
const username = secrets.dbuser;
const url = `mongodb+srv://puhelinluettelo:${password}@cluster0.ojph5.mongodb.net/puh?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
const uniqueValidator = require("mongoose-unique-validator");
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
