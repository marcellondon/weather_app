import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import wind from './icons/wind.svg';
import humid from './icons/humidity.svg';
import { useState } from "react";

function App() {

// state logic
  const [search, setSearch] = useState("Houston")
  const [weatherData, getWeatherData] = useState()
  const [forecastWeather, getForecastWeather] = useState()
  const [allDays, setAllDays] = useState([])
  const [isSunUp, setIsSunUp] = useState(null)
// search function - returns current weather and forecast w/ local time
  const searchClick = () => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=5ae7beb653a345a79c472533231805&q=${search}&days=7&aqi=no&alerts=no`)
      .then((res) => res.json())
      .then((result) => {
        getWeatherData(result)
        getForecastWeather(result)
        setAllDays(result.forecast.forecastday.map(result => days[new Date(result.date).getDay()]))
        getForecastWeather(result.forecast.forecastday)
        const sunsetTime = result.forecast.forecastday[0].astro.sunset
        const sunriseTime = result.forecast.forecastday[0].astro.sunrise
        const localTime = result.location.localtime.slice(10)
        timeConversion(localTime, sunriseTime, sunsetTime)

      })
  }

// Defaults app to Houston
  if (!weatherData) {
    searchClick()
  }

  const theDate = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let day = days[d.getDay()]
    let date = d.getDate()
    let month = months[d.getMonth()]


    return `${day}, ${month} ${date}`
  }

// date logic

  let today = new Date()
  let tomorrow = new Date(today)
  tomorrow.setDate = (tomorrow.getDate() + 1)
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// time conversion function and sunset checker
  const timeConversion = (localTime, sunriseTime, sunsetTime) => {

    let dateObj = new Date();

    var hours = localTime.slice(0, 3);
    var minutes = localTime.slice(4);
    var seconds = "00";


    var localFormattedTime = hours + ":" + minutes + ":" + seconds;

    let [sunsetHour, sunsetMinute] = sunsetTime.split(':');
    let sunsetSecond = "00"; // Set the second to 00
    if (sunsetTime.includes("PM")) {
      sunsetHour = parseInt(sunsetHour, 10) + 12;
    }

    dateObj.setHours(sunsetHour);
    dateObj.setMinutes(sunsetMinute.slice(0, 2));
    dateObj.setSeconds(sunsetSecond);
    let formattedSunsetTime = dateObj.toTimeString().split(' ')[0];

    let [sunriseHour, sunriseMinute] = sunriseTime.split(':');
    let sunriseSecond = "00"; // Set the second to 00

    if (sunriseTime.includes("PM")) {
      sunriseHour = parseInt(sunriseHour, 10) + 12;
    }

    dateObj.setHours(sunriseHour);
    dateObj.setMinutes(sunriseMinute.slice(0, 2));
    dateObj.setSeconds(sunriseSecond);

    let formattedSunriseTime = dateObj.toTimeString().split(' ')[0];

    // Convert timestamps to Date objects
    let sunriseDate = new Date("1970-01-01 " + formattedSunriseTime);
    let localCurrentDate = new Date("1970-01-01 " + localFormattedTime.slice(1));
    let sunsetDate = new Date("1970-01-01 " + formattedSunsetTime);

    // Compare the dates
    if (localCurrentDate > sunriseDate && localCurrentDate < sunsetDate) {
      setIsSunUp(true)
    } else setIsSunUp(false)
  }

  return (

// alternating style based time of day

    <div className={isSunUp ? "app" : "app-sunset"}>
      <main>

{/* entire search box */}
        <div className="search-box">
{/* search bar */}
          <input
            type="text"
            className='search-bar'
            placeholder='Search...'
            onChange={(e) => setSearch(e.target.value)}
          />
{/* search button */}
          <button
            type="button"
            class="btn btn-outline-success SUBMIT"
            onClick={searchClick}>
            Submit
          </button>
        </div>
{/* main weather box, current weather */}
        <div className="todays-weatherbox">
{/* searched location */}
          <div className="searched-location">
            {weatherData === undefined ? "" : `${weatherData.location.name}, ${weatherData.location.region}`}
          </div>
{/* todays date */}
          <div className="todays-date">
            {theDate(today)}

          </div>
{/* current date numbers container */}
          <div className="nums-container">
{/* current humidity */}
            <div className="humidity-int"
              style={{ fontSize: "20px" }}>
              Humidity
              <br></br>
              <img size src={humid}
                style={{ width: 40, height: 50 }}
                alt="humidity icon"
              />
              <br></br>
              {!weatherData ? "--" : weatherData.current.humidity} %
            </div>
{/* current temperature */}
            <div className="current-temp">
              {!weatherData ? "--" : Math.round(weatherData.current.temp_f)}°
            </div>
{/* wind speed in mph */}
            <div className="wind-int"
              style={{ fontSize: "20px" }}>
              Wind Speed
              <br></br>
              <img
                src={wind}
                style={{ width: 40, height: 50 }}
                alt="wind icon"
              />
              <br></br>
              {!weatherData ? "--" : Math.round(weatherData.current.wind_mph)} mph
            </div>
          </div>
{/* current conditions */}
          <div className="conditions">
            <div className="condition-img">
              <img src={!weatherData ? "" : weatherData.current.condition.icon} alt="" srcset="" />
            </div>
            {!weatherData ? "" : weatherData.current.condition.text}
          </div>
{/* High and Low temperature */}
          <div className="HI/LO">
            LO {!forecastWeather ? "--" : Math.round(forecastWeather[0].day.mintemp_f)} ° / HI {!forecastWeather ? "--" : Math.round(forecastWeather[0].day.maxtemp_f)}°
          </div>
        </div>

        <div className="future-weather">

          <div className="day1"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>

            <p className="day">{allDays[2]}</p>

            <div className="future-nums-container">

              <p className='future-hi-lo' style={{ fontSize: '16px' }}>
                LO {!forecastWeather ? "--" : Math.round(forecastWeather[1].day.mintemp_f)} °
                <hr></hr>
                HI {!forecastWeather ? "--" : Math.round(forecastWeather[1].day.maxtemp_f)} °
              </p>
            </div>
            <div className="future-conditions">
            </div>
          </div>

          <div className="day2"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>

            <p className="day">{allDays[3]}</p>

            <div className="future-nums-container">

              <p className='future-hi-lo' style={{ fontSize: '16px' }}>
                LO {!forecastWeather ? "--" : Math.round(forecastWeather[2].day.mintemp_f)} °
                <hr></hr>
                HI {!forecastWeather ? "--" : Math.round(forecastWeather[2].day.maxtemp_f)} °
              </p>
            </div>
            <div className="future-conditions">
            </div>
          </div>

          <div className="day3"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>

            <p className="day">{allDays[4]}</p>

            <div className="future-nums-container">

              <p className='future-hi-lo' style={{ fontSize: '16px' }}>
                LO {!forecastWeather ? "--" : Math.round(forecastWeather[3].day.mintemp_f)} °
                <hr></hr>
                HI {!forecastWeather ? "--" : Math.round(forecastWeather[3].day.maxtemp_f)} °
              </p>
            </div>
            <div className="future-conditions">
            </div>
          </div>

          <div className="day4"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>

            <p className="day">{allDays[5]}</p>

            <div className="future-nums-container">

              <p className='future-hi-lo' style={{ fontSize: '16px' }}>
                LO {!forecastWeather ? "--" : Math.round(forecastWeather[4].day.mintemp_f)} °
                <hr></hr>
                HI {!forecastWeather ? "--" : Math.round(forecastWeather[4].day.maxtemp_f)} °
              </p>
            </div>
            <div className="future-conditions">
            </div>
          </div>

          <div className="day5"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>

            <p className="day">{allDays[6]}</p>

            <div className="future-nums-container">

              <p className='future-hi-lo' style={{ fontSize: '16px' }}>
                LO {!forecastWeather ? "--" : Math.round(forecastWeather[5].day.mintemp_f)} °
                <hr></hr>
                HI {!forecastWeather ? "--" : Math.round(forecastWeather[5].day.maxtemp_f)} °
              </p>
            </div>
            <div className="future-conditions">
            </div>
          </div>
        </div>

      </main>
    </div>

  );
}

export default App;
