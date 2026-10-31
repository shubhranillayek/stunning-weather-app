# WeatherNow — JavaScript Weather and Air Quality Dashboard

WeatherNow is a browser weather dashboard by [Shubhranil Layek](https://github.com/shubhranillayek). It uses public APIs to display current conditions, hourly and 7-day forecasts, air quality, temperature charts and side-by-side city comparisons.

Built with HTML, vanilla JavaScript, Tailwind CSS and Chart.js. The configured Open-Meteo and Nominatim endpoints do not require an API key; their service terms and usage limits still apply.

**Live demo:** [Open WeatherNow](https://shubhranillayek.github.io/stunning-weather-app/)

## Run locally

No application build step or backend server is required. Serve the files locally, for example with Python:

```bash
git clone https://github.com/shubhranillayek/stunning-weather-app.git
cd stunning-weather-app
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). An internet connection is required for API requests and CDN-hosted libraries. Browser geolocation requires permission and a secure context, such as HTTPS or localhost.

## 🚀 Key Features

1. **°C / °F Unit Toggle:** Seamlessly toggle between Celsius and Fahrenheit. All values and charts update dynamically.
2. **24-Hour Hourly Forecast:** Scrollable hourly breakdown of temperature and rain probability for the next 24 hours.
3. **Sunrise & Sunset Tracker:** Displays exact sunrise/sunset times along with a visual daylight progress bar.
4. **Air Quality Index (AQI):** Live AQI metrics (PM2.5, PM10) from Open-Meteo Air Quality API with color-coded health badges.
5. **Dark / Light Mode Toggle:** Smooth theme switcher between dark glassmorphism and clean light mode aesthetics.
6. **Weather Advisory Banners:** Automatic dismissible alerts for high rain probability (≥60%) or storm warnings.
7. **Web Share Integration:** One-click button to share current weather conditions via native Web Share API or clipboard copy.
8. **Rain Probability % Badges:** Clear precipitation badges on hourly and 7-day forecast cards.
9. **Animated Wind Compass:** Displays wind direction in cardinal coordinates (e.g., SSE 150°) with an animated directional compass arrow.
10. **Multi-City Side-by-Side Comparison:** Interactive modal to select any two cities and compare metrics side-by-side.

## 🛠️ Technologies Used

- **HTML5 & Vanilla JavaScript (ES6+)**
- **Tailwind CSS** (via CDN) for responsive glassmorphism styling
- **Chart.js** (via CDN) for trend visualizations
- **FontAwesome 6** for icons
- **Open-Meteo Forecast & Air Quality APIs** (Free & No API key needed)
- **Nominatim OpenStreetMap Geocoding API** (Free autocomplete & reverse geocoding)


## Frequently asked questions

### What does WeatherNow show?

Current weather conditions, hourly and 7-day forecasts, air-quality metrics, temperature charts and a two-city comparison view.

### Do I need an API key?

The endpoints configured in this app do not use an API key. Open-Meteo and Nominatim usage policies, quotas and availability still apply; this is not a promise of unlimited free access.

### Does the app need a backend?

No application backend is included. Browser JavaScript requests data from external APIs, and static hosting can serve the app's files.

### Is location access required?

No. You can search for a city instead. Using your current location requires browser permission and HTTPS or localhost.

