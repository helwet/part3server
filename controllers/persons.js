const personsRouter = require("express").Router();
const Person = require("../models/persons");

personsRouter.post("/api/persons", (req, res) => {
  console.log("alotetaan");
  if (req.body.name.length < 9 || req.body.number.length < 4) {
    return res
      .status(400)
      .send("name must be longer than 8 and number longer then 3");
  }
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });
  console.log("alotetaan2");
  person.save().then((savedPerson) => {
    res.json(savedPerson.toJSON());
  });
});

personsRouter.put("/api/persons/:id", (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(req.params, person, { new: true }).then(
    (updatedPerson) => {
      res.json(updatedPerson.toJSON());
    }
  );
});

personsRouter.get("/api/persons", async (request, response) => {
  const blogs = await Person.find({}).populate("user", {
    username: 1,
    name: 1
  });

  response.json(blogs.map((blog) => blog.toJSON()));
});

personsRouter.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  Person.findByIdAndRemove(id).then(() => {
    res.status(204).end().send();
  });
});

personsRouter.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  Person.findById(id).then((person) => {
    if (person) {
      res.json(person.toJSON());
    } else {
      res.status(404).end();
    }
  });
});

module.exports = personsRouter;
