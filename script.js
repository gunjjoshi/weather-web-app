document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('locationInput');
    const getWeatherButton = document.getElementById('getWeatherButton');
    const unitToggle = document.querySelectorAll('input[name="unit"]');
    const weatherDisplay = document.querySelector('.weather-display');
    const geolocationButton = document.getElementById('geolocationButton');

    // Replace 'YOUR_OPENWEATHER_API_KEY' with your actual OpenWeather API key
    const apiKey = '216cb43d0ee3dcfcadf714789ca4d989';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Function to fetch weather data based on location and unit
    function fetchWeatherData(location, unit) {
        fetch(`${apiUrl}?q=${location}&units=${unit}&appid=${apiKey}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Location not found. Please try again.');
                }
                return response.json();
            })
            .then((data) => {
                // Display weather data in the weatherDisplay div
                weatherDisplay.innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp}°</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;

                // Set the radio button for the current unit as checked
                unitToggle.forEach((radio) => {
                    if (radio.value === unit) {
                        radio.checked = true;
                    }
                });
            })
            .catch((error) => {
                // Handle errors
                weatherDisplay.innerHTML = `<p>${error.message}</p>`;
                console.error('Error:', error);
            });
    }

    // Function to handle radio button change
    function handleRadioChange() {
        const location = locationInput.value;
        const unit = document.querySelector('input[name="unit"]:checked').value;

        if (location) {
            fetchWeatherData(location, unit);
        }
    }

    // Event listener for radio buttons to update weather data
    unitToggle.forEach((radio) => {
        radio.addEventListener('change', handleRadioChange);
    });

    // Event listener for "Get Weather" button
    getWeatherButton.addEventListener('click', () => {
        handleRadioChange();
    });

    // Event listener for "Use My Location" button
    geolocationButton.addEventListener('click', () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const unit = document.querySelector('input[name="unit"]:checked').value;
                fetchWeatherDataByGeoLocation(position, unit);
            }, (error) => {
                weatherDisplay.innerHTML = '<p>Geolocation error. Please try again.</p>';
                console.error('Geolocation Error:', error);
            });
        } else {
            weatherDisplay.innerHTML = '<p>Geolocation is not supported in your browser.</p>';
        }
    });


    // Function to fetch weather data based on geolocation
    function fetchWeatherDataByGeoLocation(position, unit) {
        const { latitude, longitude } = position.coords;
        fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                // Display weather data in the weatherDisplay div
                weatherDisplay.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp}°</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Weather: ${data.weather[0].description}</p>
            `;

                // Set the radio button for the current unit as checked
                unitToggle.forEach((radio) => {
                    if (radio.value === unit) {
                        radio.checked = true;
                    }
                });
            })
            .catch((error) => {
                // Handle errors
                weatherDisplay.innerHTML = `<p>${error.message}</p>`;
                console.error('Error:', error);
            });
    }
});
