document.addEventListener('DOMContentLoaded', () => {
  const locationInput = document.getElementById('locationInput');
  const getWeatherButton = document.getElementById('getWeatherButton');
  const unitToggle = document.querySelectorAll('input[name="unit"]');
  const weatherDisplay = document.querySelector('.weather-display');
  const geolocationButton = document.getElementById('geolocationButton');

  // Replace 'YOUR_OPENWEATHER_API_KEY' with your actual OpenWeather API key
  const apiKey = '216cb43d0ee3dcfcadf714789ca4d989';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // @ funtion for to change background image according to given input

  async function setBackgroundImage(value) {
    document.querySelector('body').style.backgroundImage =
      'url(http://source.unsplash.com/1980x1080/?' + value + '+city)';
  }

  // Function to fetch weather data based on location and unit
  function fetchWeatherData(url, unit) {
    const unitType = unit === 'imperial' ? '°F' : '°C';
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Location not found. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        // Change background with location name - Replace spaces with hyphens.
        setBackgroundImage(data.name.replace(/\s+/g, "-").toLowerCase());

        // Display weather data in the weatherDisplay div

        // Put the incoming value as their input value.
        // Allows the celsius/fahrenheit button to change when clicking "Use my location"
        locationInput.value = `${data.name}, ${data.sys.country}`;
        document.querySelector('.unit-toggle').style.display = 'flex';
        weatherDisplay.innerHTML = `
        <h3 class="city">Weather In ${data.name}, ${data.sys.country}</h3>
        <h3 class="temp">Temperature : ${data.main.temp}${unitType}</h3>
        <div class="flex">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="" class="icon">
            <div class="description">${data.weather[0].main}</div>
        </div>
        <div class='flex'>
        <div class="humidity">humidity :${data.main.humidity}%,</div>
        <div class="wind">Wind speed : ${data.wind.speed} m/s</div>
        </div>

        <div class="wind">Weather : ${data.weather[0].description}</div>

    `;

        // weatherDisplay.innerHTML = `
        //             <h2>${data.name}, ${data.sys.country}</h2>
        //             <p>Temperature: ${data.main.temp}${unitType}</p>
        //             <p>Humidity: ${data.main.humidity}%</p>
        //             <p>Wind Speed: ${data.wind.speed} m/s</p>
        //             <p>Weather: ${data.weather[0].description}</p>
        //         `;

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
      const url = `${apiUrl}?q=${location}&units=${unit}&appid=${apiKey}`;
      fetchWeatherData(url, unit);
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const unit = document.querySelector(
            'input[name="unit"]:checked'
          ).value;
          const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
          fetchWeatherData(url, unit);
        },
        (error) => {
          weatherDisplay.innerHTML =
            '<p>Geolocation error. Please try again.</p>';
          console.error('Geolocation Error:', error);
        }
      );
    } else {
      weatherDisplay.innerHTML =
        '<p>Geolocation is not supported in your browser.</p>';
    }
  });
});
