var recentCities = [];
var apikey = `appid=e100aebbd5ba5e82b3e8e1a8e81880d6`;

// Checks if localstorage exists
if (localStorage.getItem('recent')===null){
} else {
    recentCities = JSON.parse(localStorage.getItem('recent'))
}

// Checks to see if valid
var checkForecast = function(city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&${apikey}`
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                createConditions(data)
                createForecast(city)
                if (!recentCities.includes(city)){
                    checkRecent(city)
                }
            })
        } else{
            throw new Error(`Invalid response!`)
        }
    })
    .catch(function(){
        document.querySelector('#search-btn').setCustomValidity("Invalid City Name")
        document.querySelector('#search-btn').click()
    })
}

// Creates Today's Forecast
var createConditions = function(data){
    // Clears Area
    $('#first-col').empty()
    $('#sec-col').empty()
    $('#conditions-info span').text(data.name)
    // First Column
    var weatherEl = $('<p>').text(data.weather[0].description)
    var weatherIconEl = $('<img>').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
    weatherEl.prepend(weatherIconEl)
    $('#first-col').append($('<p>').text('Today'), weatherEl)
    // Second Column
    var tempEl = $('<p>').text(`Temperature: ${data.main.temp} F`)
    var humidityEl = $('<p>').text(`Humidity: ${data.main.humidity}%`)
    var windEl = $('<p>').text(`Wind: ${data.wind.speed} Miles/HR`)
    $('#sec-col').append(tempEl, humidityEl, windEl)
    $('.forecast-container').show()
}

// Creates 5 day Forecasts
var createForecast = function(city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${city}&${apikey}`
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // Clears Area
                $('#forecast-info').empty()
                let i = 0
                for(let dayIndex = 0;dayIndex<5;dayIndex++){
                    // Converts day to String
                    var day = data.list[i].dt_txt
                        day = day.substring(0, 10)
                        day = new Date(`${day}T00:00:00`)
                        day = day.toString().substring(0, 15)
                    dayEl = $('<p>').text(day)
                    // Creates Icon
                    var weatherEl = $('<p>').text(data.list[i].weather[0].description)
                    var weatherIcon = $('<img>').attr('src', `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`)
                    weatherEl.prepend(weatherIcon)
                    // Creates Temp/Humidity
                    var tempEl = $('<p>').text(`Temperature: ${data.list[i].main.temp} F`)
                    var humidityEl = $('<p>').text(`Humidity: ${data.list[i].main.humidity}%`)
                    var containerEl = $('<div>').attr('class', 'card p-1')
                    containerEl.append(dayEl, weatherEl, tempEl, humidityEl)
                    $('#forecast-info').append(containerEl)
                    i += 8;
                }
            })
        }else{
            console.log(`ERROR`)
        }
    })
}

// Checks to see how to add new city to recent
var checkRecent = function(city){
    recentCities.push(city)
    if ($('.recent-cities li').length < 5){
        createRecent()
    } else {
        recentCities.shift()
        createRecent()
    }
}

// Creates all recent buttons
var createRecent = function(){
    $('.recent-cities').empty()
    for(let i = recentCities.length - 1; i >= 0; i--){
        var cityEl = $('<li>').attr('class', 'recent-city bg-dark text-light m-1 p-1').text(recentCities[i])
        $('.recent-cities').append(cityEl)
    }
    $('#recent-cities-title').show()
    localStorage.setItem('recent', JSON.stringify(recentCities))
}

// Search Button 
$('.city-form').on('submit', function(event){
    event.preventDefault()
    var city = $(this).find('#city').val().toLowerCase()
    checkForecast(city)
})

// Recent City Buttons
$('.recent-cities').on('click', 'li', function(event){
    event.preventDefault()
    var city = $(this).text()
    checkForecast(city)
})

// Hides Right Column
$('.forecast-container').hide()
// Hides Recent Cities if empty
if (recentCities.length < 1){
    $('#recent-cities-title').hide()
} else {
    createRecent()
}
// checkForecast('78753')