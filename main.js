const cityEntered = document.getElementById('searchCity'); //Search bar
const searchBtn = document.querySelector('.search-btn'); //searchbar
const displayCity = document.querySelector('#displayCity');
const dateDisplay = document.querySelector('#dateDisplay');
const errorText = document.querySelector('.error');
const header3 = document.querySelectorAll('.header-3');
console.log(header3);
const temp = document.querySelector('#temp');
const feelsLike = document.querySelector('#feelsLike');
const humidityE = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const windDirection = document.querySelector('#wind-degree');
const condition = document.querySelector('#condition');


let city;
let click = 0; // TO get if the search button has been clicked..
searchBtn.addEventListener('click', () => {
    city = cityEntered.value
    console.log('btnclicked and value is' + city)

    click++
    console.log(click)

    getForecast(city)
})

console.log(click)
//Generating Forecast
/* let city = 'Ilorin'; */


async function getForecast(city) {

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7f1c8c5f2d6f4607b417119c28ac63c7`;

        const response = await fetch(url)
        /* console.log(response) */

        const data = await response.json()
        /* console.log(data); */

        if (data.cod != 200) {
            throw new Error(data.message)
        } else {
            errorText.innerHTML = '' //Clearing any previous error message
        }
        /* console.log(data.message) */
        /*  */
        //returned City
        const returnedCity = data.city.name;

        //returned Country
        const returnedCountry = data.city.country;

        /* displayCity.textContent = returnedCity + ', ' + returnedCountry.valueOf();
        console.log(displayCity); */
        // CONVERTING COUNTRY CODE
        const countryObj = new Intl.DisplayNames(['en'], { type: 'region' });
        const countryFull = countryObj.of(returnedCountry);


        //Displaying It
        displayCity.textContent = returnedCity + ', ' + countryFull;

        //Getting only the List of Weather in Relation to TIME ZONE
        const dataList = data.list;
        console.log(dataList);

        //ApI time
        let apiTime = dataList[0].dt_txt
        console.log(apiTime);

        //API Time stamps
        let apiTImeStamp = dataList[0].dt
        console.log(apiTImeStamp);

        //Logic Implementation To get Closest forcast
        let closestForecast = null;
        let closestDifference = Infinity;
        const dateTS = Math.floor(Date.now() / 1000);//Because .now is in millseconds

        dataList.forEach(item => {
            let forecastTime = item.dt;

            let diff = Math.abs(forecastTime - dateTS);


            if (diff < closestDifference) {
                closestDifference = diff;
                closestForecast = item;
            }

        });

        console.log(closestForecast)
        /* Onject_Parent Keys */
        const mainObj = closestForecast.main;
        const windObj = closestForecast.wind;
        const conditionObj = closestForecast.weather[0].main;

        /* Children Keys */
        const temperature = mainObj.temp;
        const feelLike = mainObj.feels_like;
        const humidity = mainObj.humidity;
        const windS = windObj.speed;
        const windD = windObj.deg;

        /* Appending to DOM */
        temp.textContent = temperature;
        feelsLike.textContent = feelLike;
        humidityE.textContent = humidity;
        windSpeed.textContent = windS;
        windDirection.textContent = windD;
        condition.textContent = conditionObj;




        /* for (let i = 0; i < 40; i++) {
            if (list[i]) { }
        } */

        //getting Locale Date
        const date = new Date();//Full Date

        const fullMonth = date.toLocaleString('default', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        console.log(fullMonth);
        dateDisplay.innerHTML = fullMonth;

        header3.forEach((header) => {
            header.classList.add('active');
        });



    }

    catch (err) {
        console.error('Error', err.message);
        errorText.innerHTML = err.message;
    }



};

//Assigning Search to Enter Key
cityEntered.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        searchBtn.click()
        cityEntered.blur();
    }
});





