import React, { useState, useEffect } from "react";

const CountryFilter = ({
  allCountries,
  setSearchResults,
  setSingleCountry,
  setError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setError("Enter the name of the country.");
      setSearchResults([]);
      setSingleCountry(null);
      return;
    }

    const filteredCountries = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCountries.length > 10) {
      setError("Too many countries. Please make your query more specific.");
      setSearchResults([]);
      setSingleCountry(null);
    } else if (filteredCountries.length > 1) {
      setSearchResults(filteredCountries);
      setError("");
      setSingleCountry(null);
    } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      setSearchResults([]);
      setError("");
      setSingleCountry(country);
    } else {
      setError("No matching countries found.");
      setSearchResults([]);
      setSingleCountry(null);
    }
  }, [searchQuery, allCountries, setSearchResults, setSingleCountry, setError]);

  return (
    <div>
      <label>find countries </label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter country name"
      />
    </div>
  );
};

export default CountryFilter;
