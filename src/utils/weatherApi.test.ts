import { searchCities, getWeatherForecast } from './weatherApi';

// Mock fetch for testing
global.fetch = jest.fn();

describe('weatherApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('searchCities', () => {
    it('should fetch cities successfully', async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            name: 'London',
            latitude: 51.5074,
            longitude: -0.1278,
            country: 'United Kingdom',
            country_code: 'GB',
            admin1: 'England',
            timezone: 'Europe/London',
            population: 8982000,
            elevation: 25,
            feature_code: 'PPLC',
            admin1_id: 1,
            admin2_id: 1,
            admin3_id: 1,
            admin4_id: 1,
            country_id: 1,
            postcodes: ['EC1A', 'WC1A'],
            admin2: 'Greater London',
            admin3: '',
            admin4: ''
          }
        ],
        generationtime_ms: 0.123
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchCities('London');

      expect(fetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=London&count=10&language=en&format=json'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchCities('London')).rejects.toThrow('Geocoding API error: 500');
    });

    it('should handle special characters in city names', async () => {
      const mockResponse = { results: [], generationtime_ms: 0.1 };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchCities('São Paulo');

      expect(fetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=10&language=en&format=json'
      );
    });
  });

  describe('getWeatherForecast', () => {
    it('should fetch weather forecast successfully', async () => {
      const mockWeatherResponse = {
        latitude: 51.5,
        longitude: -0.13,
        generationtime_ms: 0.5,
        utc_offset_seconds: 0,
        timezone: 'GMT',
        timezone_abbreviation: 'GMT',
        elevation: 25,
        current_weather: {
          temperature: 15.2,
          windspeed: 10.5,
          winddirection: 270,
          weathercode: 1,
          is_day: 1,
          time: '2023-01-01T12:00'
        },
        daily_units: {
          time: 'iso8601',
          weathercode: 'wmo code',
          temperature_2m_max: '°C',
          temperature_2m_min: '°C'
        },
        daily: {
          time: ['2023-01-01', '2023-01-02'],
          weathercode: [1, 2],
          temperature_2m_max: [15.5, 16.2],
          temperature_2m_min: [8.1, 9.3],
          apparent_temperature_max: [14.8, 15.9],
          apparent_temperature_min: [7.5, 8.8],
          sunrise: ['2023-01-01T08:00', '2023-01-02T08:01'],
          sunset: ['2023-01-01T16:30', '2023-01-02T16:31'],
          precipitation_sum: [0.0, 2.5],
          rain_sum: [0.0, 2.5],
          showers_sum: [0.0, 0.0],
          snowfall_sum: [0.0, 0.0],
          precipitation_hours: [0.0, 3.0],
          precipitation_probability_max: [10, 80],
          windspeed_10m_max: [12.5, 15.2],
          windgusts_10m_max: [20.1, 25.3],
          winddirection_10m_dominant: [270, 280],
          shortwave_radiation_sum: [5.2, 3.8],
          et0_fao_evapotranspiration: [1.2, 0.9]
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await getWeatherForecast(51.5, -0.13);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.open-meteo.com/v1/forecast?')
      );
      expect(result).toEqual(mockWeatherResponse);
    });

    it('should handle weather API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getWeatherForecast(51.5, -0.13)).rejects.toThrow('Weather API error: 404');
    });
  });
});
