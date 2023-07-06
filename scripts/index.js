const selectedOption = document.getElementById("selectedOption");
const button = document.getElementById("searchButton");
const error = document.getElementById("error");
const form = document.getElementById("form");
const selectCityInfo = document.getElementById("selectCityInfo");
const loading = document.getElementById("loading");
const weather = document.getElementById("weather");

const city = document.getElementById("city");
const date = document.getElementById("date");
const hour = document.getElementById("hour");
const temperature = document.getElementById("temperature");
const totalPrecipitation = document.getElementById("totalPrecipitation");
const pressure = document.getElementById("pressure");

const fetchWeatherData = async (selectedCity) => {
    // api call and return data as object
    try {
        const response = await fetch(
            `https://danepubliczne.imgw.pl/api/data/synop/station/${selectedCity}`
        );
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return;
    }
};

const getWeather = async (event) => {
    event.preventDefault();
    //checking if selected city is the same as previous to prevent unnecessary api call
    const selectedCityName =
        selectedOption.options[selectedOption.selectedIndex].text;
    const currentCity = city.textContent;

    if (selectedCityName === currentCity) return;

    //checking if selected city in form isn't empty to don't let send incorrect request
    const selectedCity = selectedOption.value;
    if (!selectedCity) {
        selectedOption.focus();
        selectedOption.style.borderColor = "red";
        error.textContent = "Wybierz miasto!";
        return;
    }

    loading.style.display = "block";
    selectCityInfo.style.display = "none";
    weather.style.display = "none";

    const data = await fetchWeatherData(selectedCity);
    displayWeatherData(data);

    loading.style.display = "none";
    weather.style.display = "block";
};

const displayWeatherData = (data) => {
    if (!data) {
        return;
    }
    city.textContent = data?.stacja;
    date.textContent = data?.data_pomiaru;
    hour.textContent = data?.godzina_pomiaru + ":00";
    temperature.textContent = data?.temperatura + "ºC";
    totalPrecipitation.textContent = "Suma opadów: " + data?.suma_opadu + "mm";
    pressure.textContent = "Ciśnienie: " + data?.cisnienie + "hPa";
    // setting current weather data to localStorage as string
    localStorage.setItem("weatherData", JSON.stringify(data));
};


// checking if previous weather data exist in localStorage, if true parse to JS object and pass as argument to display fn
const storedWeatherData = localStorage.getItem("weatherData");
if (storedWeatherData) {
    selectCityInfo.style.display = "none";
    const data = JSON.parse(storedWeatherData);
    displayWeatherData(data);
}

button.addEventListener("click", getWeather);

//reset text and style when user choose city
const removeError = () => {
    error.textContent = "";
    selectedOption.style.borderColor = "";
    selectedOption.blur();
};

form.addEventListener("change", removeError);
