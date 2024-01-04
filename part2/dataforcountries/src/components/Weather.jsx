import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`
        );
        setWeather(weatherResponse.data);
        setError("");
      } catch (error) {
        setWeather(null);
        setError("Error fetching weather data.");
      }
    };

    if (capital) {
      fetchWeatherData();
    }
  }, [capital]);

  if (!weather) {
    return null;
  }

  const weatherIconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div>
      <h3>Weather in {weather.name}:</h3>
      <p>
        Temperature: {Number((weather.main.temp - 273.15).toFixed(2))} Celsius
      </p>
      <img src={weatherIconUrl} alt="Weather Icon" />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
