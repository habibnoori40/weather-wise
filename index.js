
import Model from "./script/model.min.js";
document.body.innerHTML = Model();

const weather_sc = document.getElementById("weather-sc");
const city = document.getElementById("city");
const country = document.getElementById("country");
const date = document.getElementById("date");
const time = document.getElementById("time");
const tempreture = document.getElementById("tempreture");
const condition = document.getElementById("condition");
const windspeed = document.getElementById("windspeed");
const humidity = document.getElementById("humidity");
const rain = document.getElementById("rain");
const feelsLike = document.getElementById("feels-like");

const main = document.getElementById("main");
const popOut = document.getElementById("forecast-popout");
const searchInput = document.getElementById("search-input");
const list = document.getElementById("dropDownList");
const aboutUs = document.getElementById("about-us");

fetch("https://gregarious-froyo-8a5085.netlify.app/.netlify/functions/getApi").then((response)=> response.json()).then((data)=>{
  console.log(data)
})

function search(apiKey) {
  let timer;
  searchInput.addEventListener("input", (event) => {
    let searchQuery = event.target.value;
    if (searchQuery === "") return;
    list.innerHTML = "loading...";
    list.classList.add("p-4", "text-slate-900")
    clearTimeout(timer);
    const resolvedPromise = fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchQuery}`).then((response) => response.json());
    resolvedPromise.then((locationData) => {
      timer = setTimeout(() => {
        handleLocationData(locationData)
      })
    }, 500)
  })
}

function weatherWise(apiKey) {
  const getCityName = localStorage.getItem("city") || "mecca";
  const days = 3;
  const resolvedPromise = fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${getCityName}&days=${days}`).then((response) => response.json());
  resolvedPromise.then((weatherData) => {
    updateURL(`?location=${getCityName}`)
    handleWeatherData(weatherData);
  })
}

function handleLocationData(loctaionData) {
  list.innerHTML = "";
  list.classList.remove("p-4")
  const fragment = document.createDocumentFragment();
  loctaionData.slice(0, 4).forEach((location, index, arr) => {
    let flag = arr.findIndex((item) => item.name === location.name) === index;
    if (!flag) return;
    const city = document.createElement("li");
    const region = document.createElement("small");
    city.className = "-mt-1 m-4 text-slate-800 border-b-2 border-b-slate-700 font-medium w-fit cursor-pointer hover:border-b-sky-700 hover:text-sky-700 transition-all"
    region.className = "text-slate-800 pl-4";
    city.textContent = location.name;
    region.textContent = location.country;
    fragment.appendChild(city)
    city.before(region)
    list.appendChild(fragment)
    city.addEventListener("click", () => {
      const cityName = city.textContent.trim();
      localStorage.setItem("city", cityName)
      weatherWise()
      list.innerHTML = "";
      searchInput.value = "";
      weather_sc.style.transform = "scale(0) translateY(-150%)";
      setTimeout(() => {
        weather_sc.style.transform = "scale(1) translateY(0%)";
      }, 650)
    })
  })
}

function handleWeatherData(weatherData) {
  const localDateTime = new Date(weatherData.location.localtime);
  const dayInStr = localDateTime.toLocaleDateString("en-US", { weekday: "long" });
  const monthInStr = localDateTime.toLocaleDateString("en-US", { month: "short" });
  const getTime = localDateTime.toLocaleTimeString(undefined, { hour12: true }).replace(":00", "");
  city.innerHTML = weatherData.location.name;
  country.innerHTML = weatherData.location.country;
  date.innerHTML = `${dayInStr} ${localDateTime.getDate()} ${monthInStr} ${localDateTime.getFullYear()}`;
  time.innerHTML = `{${getTime}}`;
  tempreture.innerHTML = weatherData.current.temp_c;
  if (weatherData.current.condition.text.length >= 15) condition.classList.add("text-xl")
  condition.innerHTML = weatherData.current.condition.text;
  windspeed.innerHTML = weatherData.current.wind_mph + " <sup>mph</sup>";
  humidity.innerHTML = weatherData.current.humidity + "%";
  rain.innerHTML = weatherData.forecast.forecastday[0].day.daily_chance_of_rain + "%";
  feelsLike.innerHTML = weatherData.current.feelslike_c;
  condtiionIconMapping(weatherData);
  forecast(weatherData);
  stateChange(weatherData)
}

function condtiionIconMapping(data) {
  const conditionImg = document.getElementById("img-condition");
  const conditionCode = data.current.condition.code;
  const isDay = data.current.is_day;
  const baseURL = "./icons/";
  const iconMap = {
    "1000": isDay ? "sunny.png" : "night.gif",
    "1003": isDay ? "sunny-cloud.png" : "cloud-moon.png",
    "1006": "clouds.png",
    "1009": "clouds-2.png",
    "1030": "mist.png",
    "1063": "rain.gif",
    "1066": "snow.gif",
    "1069": "sleet-light.png",
    "1072": "snowflake.png",
    "1087": "lightening.png",
    "1114": "snowfall.png",
    "1117": "blizzard.png",
    "1135": "mist.png",
    "1147": "mist.png",
    "1150": "snowflake.png",
    "1153": "snowflake.png",
    "1168": "sleet-light.png",
    "1171": "blizzard.png",
    "1180": "rain.png",
    "1183": "rain.png",
    "1186": "moderate-rain.png",
    "1189": "moderate-rain.png",
    "1192": "heavy-rain.png",
    "1195": "heavy-rain.png",
    "1198": "snowing.png",
    "1201": "sleet-heavy.png",
    "1204": "sleet-light.png",
    "1207": "sleet-heavy.png",
    "1210": "snow.gif",
    "1213": "snow.gif",
    "1216": "snowfall.png",
    "1219": "snowfall.png",
    "1222": "snowflake.png",
    "1225": "snowflake.png",
    "1237": "snowing.png",
    "1240": "rain.gif",
    "1243": "moderate-rain.png",
    "1246": "rain.gif",
    "1249": "sleet-light.png",
    "1252": "sleet-heavy.png",
    "1255": "snow.gif",
    "1261": "snowing.png",
    "1264": "snowflake.png",
    "1273": "rain-thunder.png",
    "1276": "storm.png",
    "1279": "snowstorm.png",
    "1282": "snowstorm.png",
  };
  const iconURL = baseURL + iconMap[conditionCode];
  conditionImg.src = iconURL;
  conditionImg.alt = "Weather Condition Icon";
}

function forecast(data) {
  const forecastBtns = document.querySelectorAll("#forecasts button");
  const t_city = document.getElementById("t_city")
  const t_date = document.getElementById("t_date")
  const t_humditiy = document.getElementById("t_humidity");
  const t_maxtemp_c = document.getElementById("t_maxtemp_c");
  const t_condition = document.getElementById("t_condition");
  const t_mintemp_c = document.getElementById("t_mintemp_c");
  const t_maxtemp_f = document.getElementById("t_maxtemp_f");
  const t_rain = document.getElementById("t_rain");
  const t_mintemp_f = document.getElementById("t_mintemp_f");
  const t_wind = document.getElementById("t_wind");
  const t_snow = document.getElementById("t_snow");
  const t_totalprecip = document.getElementById("t_totalprecip");
  const t_totalsnow = document.getElementById("t_totalsnow");
  forecastBtns.forEach((btn, indx) => {
    let forecastDates = data.forecast.forecastday[indx + 1].date;
    forecastDates = forecastDates.replace(/\d{4}-/, "").replace("-", "/");
    btn.innerHTML = forecastDates;
    btn.addEventListener("click", () => {
      const forecastData = data.forecast.forecastday[indx + 1];
      const t_getDate = new Date(forecastData.date);
      const weekdayInStr = t_getDate.toLocaleDateString("en-US", { weekday: "long" });
      const forecastMonthInStr = t_getDate.toLocaleDateString("en-US", { month: "short" });
      t_city.innerHTML = data.location.name;
      t_date.innerHTML = `${weekdayInStr} ${t_getDate.getDate()} ${forecastMonthInStr}`;
      t_humditiy.innerHTML = `Humidity: ${forecastData.day.avghumidity}%`;
      t_maxtemp_c.innerHTML = `Temperature: ${forecastData.day.maxtemp_c} <sup class="font-bold">C</sup>`;
      t_condition.innerHTML = `${forecastData.day.condition.text}`;
      t_mintemp_c.innerHTML = `Temperature: ${forecastData.day.mintemp_c} <sup class="font-bold">C</sup>`;
      t_maxtemp_f.innerHTML = `Temperature: ${forecastData.day.maxtemp_f} <sup class="font-bold">F</sup>`;
      t_rain.innerHTML = `Daily chance of rain: ${forecastData.day.daily_chance_of_rain}%`;
      t_mintemp_f.innerHTML = `Temperature: ${forecastData.day.mintemp_f} <sup class="font-bold">F</sup>`;
      t_wind.innerHTML = `Wind: ${forecastData.day.maxwind_mph} <sup class="font-bold">mph</sup>`;
      t_snow.innerHTML = `Daily chance of Snow: ${forecastData.day.daily_chance_of_snow}%`;
      t_totalprecip.innerHTML = `Total precipitation: ${forecastData.day.totalprecip_mm} <sup class="font-bold">mm</sup>`;
      t_totalsnow.innerHTML = `Total Snow: ${forecastData.day.totalsnow_cm} <sup class="font-bold">cm</sup>`
      forecastPopOut()
    })
  })
}

function forecastPopOut() {
  const closeBtn = document.getElementById("close");
  popOut.classList.remove("hidden");
  popOut.classList.add("animate-popUp");
  popOut.classList.remove("animate-popClose");
  closeBtn.addEventListener("click", () => {
    popOut.classList.add("animate-popClose");
    setTimeout(() => {
      popOut.classList.add("hidden");
    }, 1000);
  });
}

function stateChange(data) {
  const ELs = document.querySelectorAll("[data-tempSymbol]");
  const weatherBTNs = document.getElementById("weatherTemp");
  weatherBTNs.addEventListener("click", (event) => {
    const BTN = event.target.closest("button");
    if (!BTN) return;
    const { current: { temp_f, feelslike_f, temp_c, feelslike_c } } = data;
    ELs.forEach((EL, index) => {
      if (BTN.id === "fahrenheit") {
        EL.setAttribute("data-tempSymbol", "F");
        EL.textContent = index == 0 ? temp_f : feelslike_f;
      } else {
        EL.setAttribute("data-tempSymbol", "O");
        EL.textContent = index == 0 ? temp_c : feelslike_c;
      }
    })
    const otherBtn = BTN.id === "fahrenheit" ? document.getElementById("celsius") : document.getElementById("fahrenheit");
    otherBtn.classList.remove("active-degree");
    BTN.classList.add("active-degree");
  })
}

function themeChange() {
  const leftSide = document.getElementById("weather-content");
  const BTN = document.getElementById("themeMood");
  let mood = "Light";
  BTN.addEventListener("click", () => {
    if (mood == "Light") {
      mood = "Dark"
      BTN.innerHTML = mood;
      main.parentElement.classList.replace("light", "dark");
      aboutUs.classList.add("text-white")
      leftSide.classList.replace("inner-light-left", "inner-dark-left")
      condition.classList.replace("condition-light", "condition-dark")
      popOut.classList.replace("inner-light-left", "inner-dark-left")
    } else {
      mood = "Light"
      BTN.innerHTML = mood;
      main.parentElement.classList.replace("dark", "light")
      aboutUs.classList.remove("text-white")
      leftSide.classList.replace("inner-dark-left", "inner-light-left")
      condition.classList.replace("condition-dark", "condition-light")
      popOut.classList.replace("inner-dark-left", "inner-light-left")
    }
  })
}

function about() {
  const aboutLi = document.getElementById("about");
  const aboutCloseBtn = document.getElementById("aboutClose");
  aboutLi.addEventListener("click", () => {
    updateURL(`#about`)
    main.classList.add("scale-0", "translate-y-1/2");
    aboutUs.classList.remove("hidden")
    setTimeout(() => {
      aboutUs.classList.replace("-translate-x-full", "translate-x-0");
      main.classList.add("hidden");
    }, 600)
  });
  aboutCloseBtn.addEventListener("click", () => {
    updateURL(`?location=${localStorage.getItem("city")}`)
    main.classList.remove("hidden");
    aboutUs.classList.replace("translate-x-0", "-translate-x-full")
    setTimeout(() => {
      main.classList.remove("scale-0", "translate-y-1/2");
      aboutUs.classList.add("hidden")
    }, 600)
  });
}

function updateURL(endPointUrl) {
  const url = `${location.origin}${location.pathname}${endPointUrl}`;
  history.replaceState(null, "", url);
}