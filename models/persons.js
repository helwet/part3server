const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = `mongodb+srv://puhelinluettelo:${process.env.password}@cluster0.ojph5.mongodb.net/puh?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  number: String
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
