import { GeocodingResponse, WeatherResponse } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const searchCities = async (cityName: string): Promise<GeocodingResponse> => {
  const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`);
  
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }
  
  return response.json();
};

export const getWeatherForecast = async (latitude: number, longitude: number): Promise<WeatherResponse> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'windspeed_10m_max',
      'windgusts_10m_max',
      'winddirection_10m_dominant',
      'shortwave_radiation_sum',
      'et0_fao_evapotranspiration'
    ].join(','),
    timezone: 'auto',
    forecast_days: '7'
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
};
