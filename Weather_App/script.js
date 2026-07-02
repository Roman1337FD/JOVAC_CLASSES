const weatherApiKey = "enter_your_weather_API _KEY";
const newsApiKey = "enter_your_gnews_API _KEY";
const aiApiKey = "enter_your_gemini_API _KEY";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const newsContainer = document.getElementById("news-container");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {

    const cityName = cityInput.value.trim();

    if (cityName === "") {
        alert("Please enter city name");
        return;
    }

    try {

        const weatherResponse = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${cityName}&aqi=no`
        );

        if (!weatherResponse.ok) {
            throw new Error("City not found");
        }

        const weatherData = await weatherResponse.json();

        city.textContent =
            `${weatherData.location.name}, ${weatherData.location.country}`;

        temp.textContent =
            `${Math.round(weatherData.current.temp_c)}°C`;

        desc.textContent =
            weatherData.current.condition.text + " 🌤️";

        humidity.textContent =
            `Humidity : ${weatherData.current.humidity}%`;

        const newsResponse = await fetch(
            `https://gnews.io/api/v4/search?q=${cityName}&lang=en&max=5&apikey=${newsApiKey}`
        );

        const newsData = await newsResponse.json();

        newsContainer.innerHTML = "";

        if (!newsData.articles || newsData.articles.length === 0) {

            newsContainer.textContent = "No News Found";

        } else {

            newsData.articles.forEach(article => {

                const div = document.createElement("div");

                div.classList.add("news-item");

                div.innerHTML = `
                    <a href="${article.url}" target="_blank">
                        ${article.title}
                    </a>
                `;

                newsContainer.appendChild(div);

            });

        }

    } catch (error) {

        console.log(error);

        city.textContent = "Error";
        temp.textContent = "";
        desc.textContent = error.message;
        humidity.textContent = "";
        newsContainer.textContent = "";

    }

}
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", askAI);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        askAI();
    }
});

async function askAI() {

    const question = userInput.value.trim();

    if (question === "") {
        alert("Please enter a question");
        return;
    }

    chatBox.innerHTML += `
        <div class="user-message">${question}</div>
    `;

    userInput.value = "";

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiApiKey}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }

        const answer = data.candidates[0].content.parts[0].text;

        chatBox.innerHTML += `
            <div class="ai-message">${answer}</div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.log(error);

        chatBox.innerHTML += `
            <div class="ai-message">
                ${error.message}
            </div>
        `;

    }

}