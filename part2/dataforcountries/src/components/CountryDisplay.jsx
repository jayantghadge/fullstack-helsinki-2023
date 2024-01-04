import React from "react";
import Weather from "./Weather";

const CountryDisplay = ({ country }) => {
  const {
    name: { common },
    capital,
    area,
    languages,
    flags,
  } = country;

  return (
    <div>
      <h2>{common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {area}</p>
      <div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
      </div>
      <img
        src={flags.png}
        alt={`${common} flag`}
        style={{ maxWidth: "150px" }}
      />
      <Weather capital={capital} />
    </div>
  );
};

export default CountryDisplay;
