// DOM Elements
const citySearch = document.getElementById('city-search');
const suggestionsList = document.getElementById('suggestions-list');
const searchSuggestions = document.getElementById('search-suggestions');
const btnLocation = document.getElementById('btn-location');
const weatherDashboard = document.getElementById('weather-dashboard');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const weatherBg = document.getElementById('weather-bg');

// Buttons & Controls
const btnUnit = document.getElementById('btn-unit');
const unitLabel = document.getElementById('unit-label');
const btnTheme = document.getElementById('btn-theme');
const themeIcon = document.getElementById('theme-icon');
const btnCompare = document.getElementById('btn-compare');
const btnFavorite = document.getElementById('btn-favorite');
const btnShare = document.getElementById('btn-share');

// Alert Banner
const weatherAlert = document.getElementById('weather-alert');
const alertTitle = document.getElementById('alert-title');
const alertDesc = document.getElementById('alert-desc');
const btnCloseAlert = document.getElementById('btn-close-alert');

// Current Weather Displays
const elCity = document.getElementById('current-city');
const elDate = document.getElementById('current-date');
const elTemp = document.getElementById('current-temp');
const elDesc = document.getElementById('current-desc');
const elFeelsLike = document.getElementById('current-feels-like');
const elIcon = document.getElementById('current-icon');
const elHumidity = document.getElementById('current-humidity');
const elWind = document.getElementById('current-wind');
const windCompassIcon = document.getElementById('wind-compass-icon');
const windDirectionText = document.getElementById('wind-direction-text');
const elUV = document.getElementById('current-uv');
const elAQI = document.getElementById('current-aqi');
const aqiBadge = document.getElementById('aqi-badge');

// Sunrise & Sunset
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');
const daylightProgressBar = document.getElementById('daylight-progress-bar');
const daylightProgressText = document.getElementById('daylight-progress-text');

// Containers
const hourlyForecastContainer = document.getElementById('hourly-forecast-container');
const forecastContainer = document.getElementById('forecast-container');
const favoritesListContainer = document.getElementById('favorites-list');
const clearFavoritesBtn = document.getElementById('clear-favorites');
const noFavoritesMsg = document.getElementById('no-favorites-msg');

// Toast
const errorToast = document.getElementById('error-toast');
const errorMsg = document.getElementById('error-msg');
const closeError = document.getElementById('close-error');

// Comparison Modal Elements
const compareModal = document.getElementById('compare-modal');
const btnCloseCompare = document.getElementById('btn-close-compare');
const compareSearch1 = document.getElementById('compare-search-1');
const compareSearch2 = document.getElementById('compare-search-2');
const compareSuggestions1 = document.getElementById('compare-suggestions-1');
const compareSuggestions2 = document.getElementById('compare-suggestions-2');
const compareList1 = document.getElementById('compare-list-1');
const compareList2 = document.getElementById('compare-list-2');
const compareContent = document.getElementById('compare-content');
const compareEmptyPrompt = document.getElementById('compare-empty-prompt');

// Application State
let currentCityData = null;
let currentWeatherData = null;
let weatherChartInstance = null;
let isCelsius = true;
let isLightMode = false;
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let compareCity1 = null;
let compareCity2 = null;

// Weather Condition Mapping
const WMO_CODES = {
    0: { desc: 'Clear sky', icon: 'fa-sun', theme: 'theme-sunny' },
    1: { desc: 'Mainly clear', icon: 'fa-cloud-sun', theme: 'theme-sunny' },
    2: { desc: 'Partly cloudy', icon: 'fa-cloud-sun', theme: 'theme-cloudy' },
    3: { desc: 'Overcast', icon: 'fa-cloud', theme: 'theme-cloudy' },
    45: { desc: 'Fog', icon: 'fa-smog', theme: 'theme-cloudy' },
    48: { desc: 'Depositing rime fog', icon: 'fa-smog', theme: 'theme-cloudy' },
    51: { desc: 'Light drizzle', icon: 'fa-cloud-rain', theme: 'theme-rainy' },
    53: { desc: 'Moderate drizzle', icon: 'fa-cloud-rain', theme: 'theme-rainy' },
    55: { desc: 'Dense drizzle', icon: 'fa-cloud-rain', theme: 'theme-rainy' },
    56: { desc: 'Light freezing drizzle', icon: 'fa-cloud-meatball', theme: 'theme-rainy' },
    57: { desc: 'Dense freezing drizzle', icon: 'fa-cloud-meatball', theme: 'theme-rainy' },
    61: { desc: 'Slight rain', icon: 'fa-cloud-showers-heavy', theme: 'theme-rainy' },
    63: { desc: 'Moderate rain', icon: 'fa-cloud-showers-heavy', theme: 'theme-rainy' },
    65: { desc: 'Heavy rain', icon: 'fa-cloud-showers-heavy', theme: 'theme-rainy' },
    66: { desc: 'Light freezing rain', icon: 'fa-cloud-meatball', theme: 'theme-rainy' },
    67: { desc: 'Heavy freezing rain', icon: 'fa-cloud-meatball', theme: 'theme-rainy' },
    71: { desc: 'Slight snow fall', icon: 'fa-snowflake', theme: 'theme-snowy' },
    73: { desc: 'Moderate snow fall', icon: 'fa-snowflake', theme: 'theme-snowy' },
    75: { desc: 'Heavy snow fall', icon: 'fa-snowflake', theme: 'theme-snowy' },
    77: { desc: 'Snow grains', icon: 'fa-snowflake', theme: 'theme-snowy' },
    80: { desc: 'Slight rain showers', icon: 'fa-cloud-showers-water', theme: 'theme-rainy' },
    81: { desc: 'Moderate rain showers', icon: 'fa-cloud-showers-water', theme: 'theme-rainy' },
    82: { desc: 'Violent rain showers', icon: 'fa-cloud-showers-water', theme: 'theme-stormy' },
    85: { desc: 'Slight snow showers', icon: 'fa-snowflake', theme: 'theme-snowy' },
    86: { desc: 'Heavy snow showers', icon: 'fa-snowflake', theme: 'theme-snowy' },
    95: { desc: 'Thunderstorm', icon: 'fa-bolt', theme: 'theme-stormy' },
    96: { desc: 'Thunderstorm with slight hail', icon: 'fa-cloud-bolt', theme: 'theme-stormy' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'fa-cloud-bolt', theme: 'theme-stormy' },
};

// --- Helper Functions ---

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

function showToast(message) {
    errorMsg.textContent = message;
    errorToast.classList.remove('translate-y-24');
    setTimeout(() => {
        errorToast.classList.add('translate-y-24');
    }, 5000);
}

closeError.addEventListener('click', () => {
    errorToast.classList.add('translate-y-24');
});

function formatTemp(celsius) {
    if (celsius === undefined || celsius === null) return '--';
    if (isCelsius) return `${Math.round(celsius)}°C`;
    const fahrenheit = (celsius * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
}

function getDayName(dateString, isToday = false) {
    if (isToday) return 'Today';
    return new Date(dateString).toLocaleDateString(undefined, { weekday: 'short' });
}

function formatClockTime(isoString) {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getWindDirection(deg) {
    if (deg === undefined) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return `${directions[index]} (${Math.round(deg)}°)`;
}

function getAQIStatus(us_aqi) {
    if (us_aqi === undefined || us_aqi === null) return { text: 'N/A', class: 'aqi-good' };
    if (us_aqi <= 50) return { text: 'Good', class: 'aqi-good' };
    if (us_aqi <= 100) return { text: 'Moderate', class: 'aqi-moderate' };
    if (us_aqi <= 150) return { text: 'Unhealthy (Sensitive)', class: 'aqi-unhealthy-sensitive' };
    if (us_aqi <= 200) return { text: 'Unhealthy', class: 'aqi-unhealthy' };
    return { text: 'Hazardous', class: 'aqi-hazardous' };
}

function updateTheme(code) {
    if (isLightMode) return;
    const theme = WMO_CODES[code]?.theme || 'theme-default';
    weatherBg.className = `fixed inset-0 z-[-1] transition-all duration-1000 opacity-80 ${theme}`;
}

// --- API Calls ---

async function fetchSuggestions(query, targetList, targetContainer, onSelect) {
    if (!query) {
        targetContainer.classList.add('hidden');
        return;
    }
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        
        targetList.innerHTML = '';
        if (data.length === 0) {
            targetContainer.classList.add('hidden');
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-gray-700 last:border-b-0 flex items-center gap-3';
            li.innerHTML = `<i class="fa-solid fa-location-dot text-gray-400"></i>
                            <div class="flex flex-col">
                                <span class="font-semibold text-sm">${item.name}</span>
                                <span class="text-xs text-gray-400">${item.display_name.split(',').slice(1,3).join(',')}</span>
                            </div>`;
            li.addEventListener('click', () => {
                targetContainer.classList.add('hidden');
                onSelect(item);
            });
            targetList.appendChild(li);
        });
        targetContainer.classList.remove('hidden');
    } catch (err) {
        console.error("Suggestions error:", err);
    }
}

async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (res.ok) {
            const data = await res.json();
            const cityName = data.city || data.locality || data.principalSubdivision;
            if (cityName) {
                const country = data.countryName ? `, ${data.countryName}` : '';
                return `${cityName}${country}`;
            }
        }
    } catch (err) {
        console.warn("BigDataCloud reverse geocode failed, trying fallback...", err);
    }

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const name = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.district || addr.suburb || addr.state_district || addr.state || (data.display_name ? data.display_name.split(',')[0] : null);
            const country = addr.country ? `, ${addr.country}` : '';
            if (name) return `${name}${country}`;
        }
    } catch (err) {
        console.warn("Nominatim fallback reverse geocode failed...", err);
    }

    return 'Current Location';
}

async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_max&past_days=7&timezone=auto`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error('Failed to get weather data');
    return await res.json();
}

async function fetchAirQuality(lat, lon) {
    try {
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`;
        const res = await fetch(aqiUrl);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

// --- Main Weather Renderer ---

async function loadWeather(lat, lon, cityName) {
    try {
        emptyState.classList.add('hidden');
        weatherDashboard.classList.add('hidden');
        loadingState.classList.remove('hidden');

        const [weatherData, aqiData] = await Promise.all([
            fetchWeather(lat, lon),
            fetchAirQuality(lat, lon)
        ]);

        currentCityData = { lat, lon, name: cityName };
        currentWeatherData = { weather: weatherData, aqi: aqiData };
        
        updateUI(weatherData, aqiData, cityName);
        checkFavoriteState();

        loadingState.classList.add('hidden');
        weatherDashboard.classList.remove('hidden');
    } catch (err) {
        loadingState.classList.add('hidden');
        emptyState.classList.remove('hidden');
        showToast('Error loading weather data. Please try again.');
        console.error(err);
    }
}

function updateUI(weatherData, aqiData, cityName) {
    const current = weatherData.current;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;
    const wmo = WMO_CODES[current.weather_code] || { desc: 'Unknown', icon: 'fa-circle-question' };

    updateTheme(current.weather_code);

    // Primary Card
    elCity.textContent = cityName;
    elDate.textContent = formatDate(current.time);
    elTemp.textContent = formatTemp(current.temperature_2m);
    elDesc.textContent = wmo.desc;
    elFeelsLike.textContent = formatTemp(current.apparent_temperature);
    
    elIcon.className = `fa-solid ${wmo.icon} text-8xl text-white drop-shadow-lg`;
    if (wmo.icon.includes('sun')) elIcon.classList.add('text-yellow-400');
    else if (wmo.icon.includes('rain') || wmo.icon.includes('showers')) elIcon.classList.add('text-blue-300');
    else elIcon.classList.remove('text-yellow-400', 'text-blue-300');

    // Metrics
    elHumidity.textContent = `${current.relative_humidity_2m}%`;
    elWind.textContent = `${current.wind_speed_10m} km/h`;
    
    if (current.wind_direction_10m !== undefined) {
        windCompassIcon.style.transform = `rotate(${current.wind_direction_10m}deg)`;
        windDirectionText.textContent = getWindDirection(current.wind_direction_10m);
    }

    const todayIndex = 7;
    const uv = daily.uv_index_max[todayIndex];
    elUV.textContent = uv ? uv.toFixed(1) : 'N/A';

    // Air Quality
    if (aqiData && aqiData.current) {
        const aqiVal = Math.round(aqiData.current.us_aqi);
        const status = getAQIStatus(aqiVal);
        elAQI.textContent = aqiVal;
        aqiBadge.textContent = status.text;
        aqiBadge.className = `text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 ${status.class}`;
    } else {
        elAQI.textContent = 'N/A';
        aqiBadge.textContent = 'Unknown';
    }

    // Sunrise & Sunset
    if (daily.sunrise && daily.sunrise[todayIndex]) {
        sunriseTime.textContent = formatClockTime(daily.sunrise[todayIndex]);
        sunsetTime.textContent = formatClockTime(daily.sunset[todayIndex]);

        // Daylight Progress
        const now = new Date();
        const rise = new Date(daily.sunrise[todayIndex]);
        const set = new Date(daily.sunset[todayIndex]);
        if (now >= rise && now <= set) {
            const pct = Math.round(((now - rise) / (set - rise)) * 100);
            daylightProgressBar.style.width = `${pct}%`;
            daylightProgressText.textContent = `${pct}% Daylight Elapsed`;
        } else if (now > set) {
            daylightProgressBar.style.width = '100%';
            daylightProgressText.textContent = 'Nighttime';
        } else {
            daylightProgressBar.style.width = '0%';
            daylightProgressText.textContent = 'Pre-dawn';
        }
    }

    // Weather Alert Banner
    const maxRainChance = daily.precipitation_probability_max[todayIndex] || 0;
    if (maxRainChance >= 60 || current.weather_code >= 80) {
        weatherAlert.classList.remove('hidden');
        alertTitle.textContent = current.weather_code >= 80 ? 'Storm Warning' : 'Rain Advisory';
        alertDesc.textContent = `${maxRainChance}% precipitation chance expected today. Take precautions if traveling!`;
    } else {
        weatherAlert.classList.add('hidden');
    }

    // 24-Hour Hourly Forecast
    renderHourlyForecast(hourly);

    // 7-Day Forecast
    render7DayForecast(daily, todayIndex);

    // Chart.js Update
    updateChart(daily);
}

function renderHourlyForecast(hourly) {
    hourlyForecastContainer.innerHTML = '';
    const nowHourIndex = new Date().getHours();
    
    // Display next 24 hours starting from current hour
    for (let i = nowHourIndex; i < nowHourIndex + 24; i++) {
        if (!hourly.time[i]) break;

        const date = new Date(hourly.time[i]);
        const timeStr = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
        const code = hourly.weather_code[i];
        const hwmo = WMO_CODES[code] || { icon: 'fa-circle-question' };
        const rainChance = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

        const card = document.createElement('div');
        card.className = 'hourly-card glass-panel rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 snap-center text-center border border-white/10';
        card.innerHTML = `
            <span class="text-xs text-gray-400">${timeStr}</span>
            <i class="fa-solid ${hwmo.icon} text-xl my-1 ${hwmo.icon.includes('sun') ? 'text-yellow-400' : ''}"></i>
            <span class="text-sm font-bold">${formatTemp(hourly.temperature_2m[i])}</span>
            <span class="text-[10px] text-blue-300 font-semibold"><i class="fa-solid fa-umbrella text-[9px]"></i> ${rainChance}%</span>
        `;
        hourlyForecastContainer.appendChild(card);
    }
}

function render7DayForecast(daily, todayIndex) {
    forecastContainer.innerHTML = '';
    for (let i = todayIndex; i < todayIndex + 7; i++) {
        if (!daily.time[i]) continue;
        const code = daily.weather_code[i];
        const dwmo = WMO_CODES[code] || { icon: 'fa-circle-question' };
        const isToday = i === todayIndex;
        const dayName = getDayName(daily.time[i], isToday);
        const rainMax = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

        const card = document.createElement('div');
        card.className = `forecast-card glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2 snap-center border ${isToday ? 'border-white/50 bg-white/20' : 'border-white/10'}`;
        card.innerHTML = `
            <span class="text-sm font-semibold">${dayName}</span>
            <i class="fa-solid ${dwmo.icon} text-2xl my-1 ${dwmo.icon.includes('sun') ? 'text-yellow-400' : ''}"></i>
            <div class="flex gap-2 text-sm">
                <span class="font-bold">${formatTemp(daily.temperature_2m_max[i])}</span>
                <span class="text-gray-400 text-xs self-center">${formatTemp(daily.temperature_2m_min[i])}</span>
            </div>
            <span class="text-[11px] text-blue-300 font-semibold"><i class="fa-solid fa-umbrella text-[10px]"></i> ${rainMax}%</span>
        `;
        forecastContainer.appendChild(card);
    }
}

function updateChart(daily) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const labels = daily.time.map(t => {
        const d = new Date(t);
        return `${d.getMonth()+1}/${d.getDate()}`;
    });

    const convertArr = (arr) => isCelsius ? arr : arr.map(c => Math.round((c * 9/5) + 32));
    const maxTemps = convertArr(daily.temperature_2m_max);
    const minTemps = convertArr(daily.temperature_2m_min);

    if (weatherChartInstance) {
        weatherChartInstance.destroy();
    }

    let gradientMax = ctx.createLinearGradient(0, 0, 0, 400);
    gradientMax.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
    gradientMax.addColorStop(1, 'rgba(255, 99, 132, 0.0)');

    let gradientMin = ctx.createLinearGradient(0, 0, 0, 400);
    gradientMin.addColorStop(0, 'rgba(54, 162, 235, 0.5)');
    gradientMin.addColorStop(1, 'rgba(54, 162, 235, 0.0)');

    Chart.defaults.color = isLightMode ? '#334155' : 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.font.family = 'Inter';

    weatherChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `High (${isCelsius ? '°C' : '°F'})`,
                    data: maxTemps,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: gradientMax,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3
                },
                {
                    label: `Low (${isCelsius ? '°C' : '°F'})`,
                    data: minTemps,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: gradientMin,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { color: isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)' } },
                y: {
                    grid: { color: isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)' },
                    ticks: { callback: (val) => `${val}°` }
                }
            }
        }
    });
}

// --- Multi-City Comparison Logic ---

async function fetchAndRenderComparison() {
    if (!compareCity1 || !compareCity2) return;
    try {
        const [w1, a1, w2, a2] = await Promise.all([
            fetchWeather(compareCity1.lat, compareCity1.lon),
            fetchAirQuality(compareCity1.lat, compareCity1.lon),
            fetchWeather(compareCity2.lat, compareCity2.lon),
            fetchAirQuality(compareCity2.lat, compareCity2.lon)
        ]);

        document.getElementById('comp-city1-name').textContent = compareCity1.name;
        document.getElementById('comp-city2-name').textContent = compareCity2.name;

        document.getElementById('comp-temp-1').textContent = formatTemp(w1.current.temperature_2m);
        document.getElementById('comp-temp-2').textContent = formatTemp(w2.current.temperature_2m);

        document.getElementById('comp-cond-1').textContent = WMO_CODES[w1.current.weather_code]?.desc || 'N/A';
        document.getElementById('comp-cond-2').textContent = WMO_CODES[w2.current.weather_code]?.desc || 'N/A';

        document.getElementById('comp-humidity-1').textContent = `${w1.current.relative_humidity_2m}%`;
        document.getElementById('comp-humidity-2').textContent = `${w2.current.relative_humidity_2m}%`;

        document.getElementById('comp-wind-1').textContent = `${w1.current.wind_speed_10m} km/h`;
        document.getElementById('comp-wind-2').textContent = `${w2.current.wind_speed_10m} km/h`;

        document.getElementById('comp-uv-1').textContent = w1.daily.uv_index_max[7]?.toFixed(1) || 'N/A';
        document.getElementById('comp-uv-2').textContent = w2.daily.uv_index_max[7]?.toFixed(1) || 'N/A';

        const aqi1 = a1?.current?.us_aqi ? Math.round(a1.current.us_aqi) : 'N/A';
        const aqi2 = a2?.current?.us_aqi ? Math.round(a2.current.us_aqi) : 'N/A';
        document.getElementById('comp-aqi-1').textContent = `${aqi1} (${getAQIStatus(aqi1).text})`;
        document.getElementById('comp-aqi-2').textContent = `${aqi2} (${getAQIStatus(aqi2).text})`;

        compareEmptyPrompt.classList.add('hidden');
        compareContent.classList.remove('hidden');
    } catch (err) {
        showToast('Error comparing cities. Please try again.');
    }
}

// --- Favorites Management ---

function renderFavorites() {
    favoritesListContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoritesListContainer.appendChild(noFavoritesMsg);
        noFavoritesMsg.classList.remove('hidden');
        clearFavoritesBtn.classList.add('hidden');
        return;
    }

    noFavoritesMsg.classList.add('hidden');
    clearFavoritesBtn.classList.remove('hidden');

    favorites.forEach((fav, index) => {
        const div = document.createElement('div');
        div.className = 'glass-panel px-4 py-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                <span class="font-semibold">${fav.name}</span>
            </div>
            <button class="text-gray-400 hover:text-red-400 p-1 delete-fav" data-index="${index}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        
        div.addEventListener('click', (e) => {
            if (e.target.closest('.delete-fav')) return;
            loadWeather(fav.lat, fav.lon, fav.name);
        });

        div.querySelector('.delete-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            favorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
            checkFavoriteState();
        });

        favoritesListContainer.appendChild(div);
    });
}

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function checkFavoriteState() {
    if (!currentCityData) return;
    const isFav = favorites.some(f => f.name === currentCityData.name);
    if (isFav) {
        btnFavorite.innerHTML = '<i class="fa-solid fa-heart text-[17px] text-red-500"></i>';
    } else {
        btnFavorite.innerHTML = '<i class="fa-regular fa-heart text-[17px]"></i>';
    }
}

// --- Event Listeners ---

// Unit Toggle °C / °F
btnUnit.addEventListener('click', () => {
    isCelsius = !isCelsius;
    unitLabel.textContent = isCelsius ? '°C' : '°F';
    if (currentWeatherData && currentCityData) {
        updateUI(currentWeatherData.weather, currentWeatherData.aqi, currentCityData.name);
    }
});

// Dark / Light Theme Toggle
btnTheme.addEventListener('click', () => {
    isLightMode = !isLightMode;
    document.body.classList.toggle('theme-light', isLightMode);
    themeIcon.className = isLightMode ? 'fa-solid fa-sun text-amber-500' : 'fa-solid fa-moon text-yellow-300';
    if (currentWeatherData && currentCityData) {
        updateUI(currentWeatherData.weather, currentWeatherData.aqi, currentCityData.name);
    }
});

// Share Weather Feature
btnShare.addEventListener('click', async () => {
    if (!currentCityData || !currentWeatherData) return;
    const current = currentWeatherData.weather.current;
    const text = `Weather in ${currentCityData.name}: ${formatTemp(current.temperature_2m)}, ${WMO_CODES[current.weather_code]?.desc || ''}. Checked via WeatherNow!`;
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'WeatherNow Update', text: text, url: window.location.href });
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        await navigator.clipboard.writeText(text);
        showToast('Weather report copied to clipboard!');
    }
});

// Alert Banner Close
btnCloseAlert.addEventListener('click', () => {
    weatherAlert.classList.add('hidden');
});

// Main Search Input
citySearch.addEventListener('input', debounce((e) => {
    fetchSuggestions(e.target.value.trim(), suggestionsList, searchSuggestions, (item) => {
        citySearch.value = item.name;
        loadWeather(item.lat, item.lon, item.name);
    });
}, 300));

document.addEventListener('click', (e) => {
    if (!citySearch.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.add('hidden');
    }
});

// Geolocation Button
btnLocation.addEventListener('click', async () => {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.');
        return;
    }
    const originalText = btnLocation.innerHTML;
    btnLocation.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
    btnLocation.disabled = true;

    try {
        const { latitude, longitude } = await getCurrentPosition();
        await loadWeatherForCoords(latitude, longitude);
    } catch (geoError) {
        // Respect an explicit permission denial; otherwise fall back to IP-based location.
        if (geoError && geoError.code === 1) {
            showToast('Location permission denied. Allow location access in your browser or search for a city.');
        } else {
            console.warn('Browser geolocation failed, falling back to IP-based location:', geoError);
            try {
                const { latitude, longitude } = await getLocationFromIP();
                await loadWeatherForCoords(latitude, longitude);
            } catch (ipError) {
                console.error('IP-based location failed:', ipError);
                showToast("Couldn't determine your location. Please search for a city instead.");
            }
        }
    } finally {
        btnLocation.innerHTML = originalText;
        btnLocation.disabled = false;
    }
});

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => {
                const e = new Error('Geolocation failed');
                e.code = error.code;
                reject(e);
            },
            { timeout: 10000, maximumAge: 300000 }
        );
    });
}

async function getLocationFromIP() {
    const res = await fetch('https://ipwho.is/');
    if (!res.ok) throw new Error('IP geolocation request failed');
    const data = await res.json();
    if (!data || data.success === false || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        throw new Error('IP geolocation returned no coordinates');
    }
    return { latitude: data.latitude, longitude: data.longitude };
}

async function loadWeatherForCoords(lat, lon) {
    const cityName = await reverseGeocode(lat, lon);
    await loadWeather(lat, lon, cityName);
}

// Favorite Buttons
btnFavorite.addEventListener('click', () => {
    if (!currentCityData) return;
    const isFav = favorites.findIndex(f => f.name === currentCityData.name);
    if (isFav >= 0) {
        favorites.splice(isFav, 1);
        showToast('Removed from favorites');
    } else {
        favorites.push(currentCityData);
        showToast('Added to favorites');
    }
    saveFavorites();
    checkFavoriteState();
    renderFavorites();
});

clearFavoritesBtn.addEventListener('click', () => {
    favorites = [];
    saveFavorites();
    renderFavorites();
    checkFavoriteState();
});

// Comparison Modal Listeners
btnCompare.addEventListener('click', () => compareModal.classList.remove('hidden'));
btnCloseCompare.addEventListener('click', () => compareModal.classList.add('hidden'));

compareSearch1.addEventListener('input', debounce((e) => {
    fetchSuggestions(e.target.value.trim(), compareList1, compareSuggestions1, (item) => {
        compareCity1 = { name: item.name, lat: item.lat, lon: item.lon };
        compareSearch1.value = item.name;
        fetchAndRenderComparison();
    });
}, 300));

compareSearch2.addEventListener('input', debounce((e) => {
    fetchSuggestions(e.target.value.trim(), compareList2, compareSuggestions2, (item) => {
        compareCity2 = { name: item.name, lat: item.lat, lon: item.lon };
        compareSearch2.value = item.name;
        fetchAndRenderComparison();
    });
}, 300));

// Init
renderFavorites();
