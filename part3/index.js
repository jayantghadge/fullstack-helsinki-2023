require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", (request) => JSON.stringify(request.body));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

// Phonebook info
app.get("/info", (request, response) => {
  const currentTime = new Date();

  Person.countDocuments({})
    .then((entryCount) => {
      const infoMessage = `
        <p>Time of Request: ${currentTime}</p>
        <p>Phonebook Entries: ${entryCount}</p>
      `;
      response.send(infoMessage);
    })
    .catch((error) => {
      console.error("Error fetching entry count:", error);
      response.status(500).json({ error: "Internal Server Error" });
    });
});

// Getting all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

// Getting person by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Deleting person by ID
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

// Adding new person
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  }

  Person.findOne({ name: body.name }).then((duplicatePerson) => {
    if (duplicatePerson) {
      return response.status(400).json({
        error: "Name must be unique",
      });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson.save().then((result) => {
      console.log("Person saved!", result);
      response.json(result);
    });
  });
});

// Updating person by ID
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    request.params.id,
    {
      name,
      number,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((personToUpdate) => {
      response.json(personToUpdate);
    })
    .catch((error) => next(error));
});

// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "Malformatted ID",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
