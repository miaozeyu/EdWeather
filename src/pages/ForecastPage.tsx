import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWeatherForecast } from '../utils/weatherApi';
import { WeatherResponse } from '../types/weather';
import WeatherChart from '../components/WeatherChartRecharts';
import styles from './ForecastPage.module.css';

const ForecastPage: React.FC = () => {
  const { lat, lon, city } = useParams<{ lat: string; lon: string; city: string }>();
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lon) return;

      setLoading(true);
      setError('');

      try {
        const data = await getWeatherForecast(parseFloat(lat), parseFloat(lon));
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Link to="/" className={styles.backLink}>← Back to Search</Link>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No weather data available</div>
        <Link to="/" className={styles.backLink}>← Back to Search</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>← Back to Search</Link>
        <h1 className={styles.cityName}>{decodeURIComponent(city || '')}</h1>
      </header>

      <div className={styles.currentWeather}>
        <h2>Current Weather</h2>
        <div className={styles.currentStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Temperature</span>
            <span className={styles.statValue}>{weatherData.current_weather.temperature}°C</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Wind Speed</span>
            <span className={styles.statValue}>{weatherData.current_weather.windspeed} km/h</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Wind Direction</span>
            <span className={styles.statValue}>{weatherData.current_weather.winddirection}°</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Conditions</span>
            <span className={styles.statValue}>
              {getWeatherDescription(weatherData.current_weather.weathercode)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.forecast}>
        <h2>7-Day Forecast</h2>
        <WeatherChart weatherData={weatherData} />
        
        <div className={styles.dailyForecast}>
          {weatherData.daily.time.map((date, index) => (
            <div key={date} className={styles.dayCard}>
              <div className={styles.dayDate}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className={styles.dayWeather}>
                {getWeatherDescription(weatherData.daily.weathercode[index])}
              </div>
              <div className={styles.dayTemps}>
                <span className={styles.tempHigh}>
                  {Math.round(weatherData.daily.temperature_2m_max[index])}°
                </span>
                <span className={styles.tempLow}>
                  {Math.round(weatherData.daily.temperature_2m_min[index])}°
                </span>
              </div>
              {weatherData.daily.precipitation_sum[index] > 0 && (
                <div className={styles.precipitation}>
                  {weatherData.daily.precipitation_sum[index]}mm
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
