const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const personsData = require("./personsData");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

morgan.token("postData", (request) => {
  if (request.method == "POST") return " " + JSON.stringify(request.body);
  else return " ";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let persons = [...personsData];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000) + 1;
  } while (persons.some((person) => person.id === newId));

  return newId;
};
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  }

  const duplicateName = persons.find((person) => person.name === body.name);
  if (duplicateName) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const initialLength = persons.length;

  persons = persons.filter((person) => person.id !== id);

  if (initialLength === persons.length) {
    // No person was deleted
    response.status(404).json({ error: "Person not found" });
  } else {
    response.status(204).end();
  }
});
app.get("/info", (request, response) => {
  const currentTime = new Date();
  const entryCount = persons.length;

  const infoMessage = `
    <p>Time of Request: ${currentTime}</p>
    <p>Phonebook Entries: ${entryCount}</p>
  `;

  response.send(infoMessage);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
