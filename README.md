# EdWeather

A modern, responsive weather application built with React, TypeScript, and Vite. Get current weather conditions and 7-day forecasts for any city worldwide using the Open-Meteo API.

## Features

- 🔍 **City Search**: Search for cities worldwide using Open-Meteo's geocoding API
- 🌤️ **Current Weather**: View current temperature, wind speed, and weather conditions
- 📊 **7-Day Forecast**: Interactive line chart showing daily temperature highs and lows
- 📱 **Mobile-First Design**: Responsive CSS modules optimized for all devices
- 💾 **Search History**: Recent searches cached in localStorage with React Context
- 🧪 **Tested**: Jest unit tests for API utilities
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS Modules (mobile-first approach)
- **State Management**: React Context API
- **Testing**: Jest with jsdom
- **APIs**: Open-Meteo (geocoding and weather data)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EdWeather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm test` - Run Jest tests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── WeatherChart.tsx
│   └── WeatherChart.module.css
├── context/            # React Context providers
│   └── SearchContext.tsx
├── pages/              # Page components
│   ├── SearchPage.tsx
│   ├── SearchPage.module.css
│   ├── ForecastPage.tsx
│   └── ForecastPage.module.css
├── types/              # TypeScript type definitions
│   └── weather.ts
├── utils/              # Utility functions
│   ├── weatherApi.ts
│   └── weatherApi.test.ts
├── App.tsx             # Main app component
├── App.css
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## API Integration

This app uses the free [Open-Meteo API](https://open-meteo.com/) for:

- **Geocoding**: Convert city names to coordinates
- **Weather Data**: Current conditions and 7-day forecasts

No API key required! The API is completely free and open-source.

## Features in Detail

### Search Functionality
- Type any city name to search globally
- Results show city, country, and coordinates
- Click any result to view its weather forecast

### Weather Display
- Current temperature, wind speed, and conditions
- 7-day forecast with daily highs and lows
- Interactive SVG line chart for temperature trends
- Weather condition descriptions based on WMO codes

### Search History
- Automatically saves your recent searches
- Stored in browser's localStorage
- Quick access to previously searched cities
- Clear history option available

### Responsive Design
- Mobile-first CSS approach
- Optimized for phones, tablets, and desktops
- Touch-friendly interface elements
- Accessible color contrast and typography

## Testing

Run the test suite:

```bash
npm test
```

The project includes unit tests for:
- API utility functions
- Error handling
- Data fetching and parsing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather data
- [Vite](https://vitejs.dev/) for the excellent build tool
- [React](https://reactjs.org/) team for the amazing framework
