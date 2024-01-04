import React, { useState, useEffect } from "react";
import axios from "axios";
import CountryFilter from "./components/CountryFilter";
import CountryDisplay from "./components/CountryDisplay";

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [singleCountry, setSingleCountry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setAllCountries(response.data);
      })
      .catch((error) => {
        setError("Error fetching all countries.");
      });
  }, []);

  return (
    <div>
      <CountryFilter
        allCountries={allCountries}
        setSearchResults={setSearchResults}
        setSingleCountry={setSingleCountry}
        setError={setError}
      />

      {error && <p>{error}</p>}

      {singleCountry && <CountryDisplay country={singleCountry} />}

      {searchResults.length > 0 && (
        <div>
          <h2>Matching Countries:</h2>
          <ul>
            {searchResults.map((country) => (
              <li key={country.cca2}>
                {country.name.common}{" "}
                <button onClick={() => setSingleCountry(country)}>
                  Show Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
