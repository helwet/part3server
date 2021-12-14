const personsRouter = require("express").Router();
const Person = require("../models/persons");

personsRouter.post("/api/persons", async (req, res) => {
  console.log("alotetaan");
  const body = req.body;
  if (body.name.length < 5 || body.number.length < 8) {
    return res
      .status(403)
      .json({ error: "name must be longer than 4 and number longer then 8" });
  }
  const person = new Person({
    name: body.name,
    number: body.number
  });
  try {
    const savedPerson = await person.save();
    console.log(savedPerson.toJSON());
    return res.status(200).json(savedPerson.toJSON());
  } catch {
    return res.status(409).json();
  }
});

personsRouter.put("/api/persons/:id", async (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  };
  try {
    const res = await Person.findByIdAndUpdate(req.params.id, person, {
      new: true
    });
    res.status(200).json(res.body.toJSON());
  } catch {
    return res.status(403).json({ error: "malformed" });
  }
});

personsRouter.get("/api/persons", async (request, response) => {
  const blogs = await Person.find({});
  console.log("terve");
  return response.json(blogs.map((blog) => blog.toJSON()));
});

personsRouter.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  Person.findByIdAndRemove(id).then(() => {
    res.status(200).end().send();
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
