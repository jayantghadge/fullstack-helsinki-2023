import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

const Filter = ({ searchTerm, handleSearchNameChange }) => {
  return (
    <div>
      Search by Name:
      <input value={searchTerm} onChange={handleSearchNameChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {person.name} - {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  const notificationClassName = `notification ${message.type || ""}`;
  return <div className={notificationClassName}>{message.text}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [deletedPersons, setDeletedPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const isPersonStillPresent = persons.some(
        (person) => person.id === existingPerson.id
      );

      if (
        isPersonStillPresent &&
        window.confirm(
          `${newName} is already in the phonebook. Replace the old number with the new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        setPersons(
          persons.map((person) =>
            person.id === existingPerson.id ? updatedPerson : person
          )
        );
        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? response : person
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification("success", `${newName}'s number was updated.`);
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            if (error.response && error.response.status === 404) {
              setPersons(
                persons.filter((person) => person.id !== existingPerson.id)
              );
              showAlertIfPersonDeleted(newName);
              showNotification(
                "error",
                `Information of ${newName} has already been removed from server.`
              );
            } else {
              setNotificationMessage({
                type: "error",
                text: "Error updating person. Please try again later.",
              });
              setTimeout(() => {
                setNotificationMessage(null);
              }, 5000);
            }
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(personObject)
        .then((response) => {
          setPersons([...persons, response]);
          setNewName("");
          setNewNumber("");
          showAlertIfPersonDeleted(newName);
          showNotification("success", `Added ${newName}`);
        })
        .catch((error) => {
          console.error("Error adding person:", error);
        });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setDeletedPersons([
            ...deletedPersons,
            { id, name: personToDelete.name },
          ]);
          showNotification(
            "success",
            `${personToDelete.name} was successfully deleted.`
          );
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
        });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const checkIfPersonDeleted = (name) => {
    return deletedPersons.some((person) => person.name === name);
  };

  const showAlertIfPersonDeleted = (name) => {
    if (checkIfPersonDeleted(name)) {
      alert(
        `Error: Information of ${name} has already been removed from the server.`
      );
    }
  };

  const showNotification = (type, text) => {
    setNotificationMessage({ type, text });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />
      <Filter
        searchTerm={searchName}
        handleSearchNameChange={handleSearchNameChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
