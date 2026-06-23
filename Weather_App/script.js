const apiKey = "a084920352f54269918232655262206"; 

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");

searchBtn.addEventListener("click", () => {
    const cityName = cityInput.value.trim();

    if (cityName === "") {
        weatherResult.innerHTML = `<p class="message" style="color: red;">Pehle city ka naam toh dalo!</p>`;
        return;
    }

    // CHANGE 1: URL ko badal kar WeatherAPI ka kiya
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City nahi mili!");
            }
            return response.json();
        })
        .then(data => {
            // CHANGE 2: WeatherAPI ke data format ke hisab se keys badli hain
            weatherResult.innerHTML = `
                <h3>${data.location.name}, ${data.location.country}</h3>
                <div class="temp">${Math.round(data.current.temp_c)}°C</div>
                <div class="desc">${data.current.condition.text} 🌤️</div>
                <p style="margin-top: 10px; color: #636e72;">Humidity: ${data.current.humidity}%</p>
            `;
        })
        .catch(error => {
            weatherResult.innerHTML = `<p class="message" style="color: red;">${error.message}</p>`;
        });
});