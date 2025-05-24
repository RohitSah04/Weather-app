// src/services/weatherService.ts
import axios from 'axios';
import { ForecastData, LocationSuggestion, WeatherData } from '../types/weather';

const API_KEY = "9be878b2886d2826e3aa96a12257396f"; // Replace with your actual key

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  const isCoord = location.includes(',');
  const [lat, lon] = location.split(',');

  const url = isCoord
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`;

  const response = await axios.get(url);

  // You should transform response to match WeatherData type
  return {
    location: response.data.name,
    country: response.data.sys.country,
    temperature: response.data.main.temp,
    feelsLike: response.data.main.feels_like,
    condition: response.data.weather[0].main,
    conditionIcon: response.data.weather[0].icon,
    humidity: response.data.main.humidity,
    windSpeed: response.data.wind.speed,
    windDirection: response.data.wind.deg,
    pressure: response.data.main.pressure,
    visibility: response.data.visibility,
    icon: response.data.weather[0].icon,
    uvIndex: response.data.uvi || 0, // Default to 0 if not available
    lastUpdated: new Date(response.data.dt * 1000).toISOString(),
    sunrise: new Date(response.data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(response.data.sys.sunset * 1000).toISOString(),
  };
};

export const fetchForecast = async (location: string): Promise<ForecastData[]> => {
  const isCoord = location.includes(',');
  const [lat, lon] = location.split(',');

  const url = isCoord
    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    : `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`;

  const response = await axios.get(url);

  // Example transformation — you may need to adjust this to your ForecastData type
  const daily = response.data.list.filter((_: any, i: number) => i % 8 === 0);

  return daily.map((entry: any) => ({
    date: entry.dt_txt,
    day: new Date(entry.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
    condition: entry.weather[0].main,
    maxTemp: entry.main.temp_max,
    minTemp: entry.main.temp_min,
    precipitation: entry.pop * 100,
  }));
};

export const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );

  return response.data.map((item: any) => ({
    name: item.name,
    country: item.country,
    state: item.state || '',
    lat: item.lat,
    lon: item.lon,
    isPostalCode: false,
  }));
};
