import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../utils/weatherApi';
import { useSearch } from '../context/SearchContext';
import { GeocodingResult } from '../types/weather';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { searchHistory, addToHistory, clearHistory } = useSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await searchCities(cityName);
      if (response.results && response.results.length > 0) {
        setSearchResults(response.results);
      } else {
        setError('No cities found. Please try a different search term.');
      }
    } catch (err) {
      setError('Failed to search for cities. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: GeocodingResult) => {
    addToHistory({
      city: `${city.name}, ${city.country}`,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    
    navigate(`/forecast/${city.latitude}/${city.longitude}/${encodeURIComponent(city.name + ', ' + city.country)}`);
  };

  const handleHistorySelect = (historyItem: any) => {
    navigate(`/forecast/${historyItem.latitude}/${historyItem.longitude}/${encodeURIComponent(historyItem.city)}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>EdWeather</h1>
        <p className={styles.subtitle}>Get weather forecasts for any city</p>
      </header>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter city name..."
            className={styles.searchInput}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !cityName.trim()} className={styles.searchButton}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {searchResults.length > 0 && (
        <div className={styles.results}>
          <h3>Search Results:</h3>
          <ul className={styles.resultsList}>
            {searchResults.map((city) => (
              <li key={city.id} className={styles.resultItem}>
                <button
                  onClick={() => handleCitySelect(city)}
                  className={styles.cityButton}
                >
                  <div className={styles.cityName}>
                    {city.name}, {city.country}
                  </div>
                  <div className={styles.cityDetails}>
                    {city.admin1 && `${city.admin1}, `}
                    Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className={styles.history}>
          <div className={styles.historyHeader}>
            <h3>Recent Searches:</h3>
            <button onClick={clearHistory} className={styles.clearButton}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {searchHistory.map((item, index) => (
              <li key={index} className={styles.historyItem}>
                <button
                  onClick={() => handleHistorySelect(item)}
                  className={styles.historyButton}
                >
                  {item.city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
