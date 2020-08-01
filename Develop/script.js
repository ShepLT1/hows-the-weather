$(document).ready(function() {

    // Retrieve city names array from local storage
    var cityArr = JSON.parse(localStorage.getItem("Cities"));

    // Variable for user-selected city used in Ajax calls
    var city = "";

    // Boolean for Ajax success/fail
    var failed = false;

    // Variable for Ajax call URLs
    var queryURL = "";

    // Variable for UV Ajax call URL
    var uvURL = "";

    // Variable for API key
    var APIkey = "75c9c0e828f465579603124bb4099fec";

    // Variable stating index of city in cityArr
    var cityIndex = "";

    // Today's date
    var today = new Date();

    // Variable date for 5 day forecast (day)
    var fiveDay = "";

    // Variable date for 5 day forecast (month)
    var fiveMonth = "";

    // Variable date for 5 day forecast (year)
    var fiveYear = "";

    // Object for today's date desired attributes
    var date = {
        day: today.getDate(),
        month: (today.getMonth() +1),
        year: today.getUTCFullYear()
    }

    // Formatted today's date
    var todayDate = date.month + "/" + date.day + "/" + date.year;

    // function to display clickable buttons with city names in aside tag
    function displayBtns() {

        $("#button-container").empty();

        for (i = 0; i < cityArr.length; i++) {

            // Creates city button for aside tag
            var cityBtn = $("<button>");

            // Creates city button remove selector 'x'
            var removeBtn = $("<i>");

            cityBtn.addClass("city-buttons btn");

            removeBtn.addClass("fa fa-times");

            removeBtn.attr("aria-hidden", "true");

            cityBtn.attr("data-name", cityArr[i]);

            removeBtn.attr("data-name", cityArr[i]);

            cityBtn.text(cityArr[i]);

            cityBtn.append(removeBtn);

            $("#button-container").append(cityBtn);

        }

    }

    // function that makes city-specific Ajax calls for current conditions and UV index
    function todayWeather() {

        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET",
            error: function() {
                alert("Please enter a valid city name");
                failed = true;
                return;
            }
        }).then(function(response) {

            failed = false;

            $("#today-head-container").empty();

            uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;

            // converts from Kelvin to Fahrenheit
            var tempF = (((response.main.temp-273.15)*1.8)+32).toFixed(2);
            // grabs weather icon ID
            var forecast = response.weather[0].icon;
            // grabs weather icon image file pertaining to grabbed ID
            var forecastIcon = "https://openweathermap.org/img/wn/" + forecast + ".png";
            // creates tag to house selected city and today's date
            var todayCityDate = $("<h3>");
            // creates image tag to hold weather icon
            var todayForecastImg = $("<img>");

            todayCityDate.attr("id", "today-weather-city-date");
            todayForecastImg.attr("id", "today-forecast-icon");
            todayForecastImg.attr("alt", "Forecast icon");
            todayForecastImg.attr("src", forecastIcon);
            
            todayCityDate.text(response.name + " (" + todayDate + ")");
            $("#today-temp").text("Temperature: " + tempF + " \xB0F");
            $("#today-humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#today-head-container").append(todayCityDate);
            $("#today-head-container").append(todayForecastImg);

            $("article").css("background-color", "rgb(0, 121, 137)");

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(uvRes) {

                // grabs UV value
                var uvVal = uvRes.value;
                // creaters container to hold UV index value and color
                var uvContainer = $("<div>");

                uvContainer.addClass("uv-color");

                $("#uv").text("UV Index: ");
                uvContainer.text(uvVal);

                $("#uv").append(uvContainer);

                if (Math.ceil(uvVal) <= 2) {

                    uvContainer.css("background-color", "rgb(178, 67, 156)");

                } else if (Math.ceil(uvVal) <= 5) {

                    uvContainer.css({"background-color": "rgb(218, 224, 33)", "color": "rgb(34, 34, 34)"});

                } else if (Math.ceil(uvVal) <= 7) {

                    uvContainer.css({"background-color": "rgb(234, 127, 21)", "color": "rgb(34, 34, 34)"});

                } else if (Math.ceil(uvVal) <= 10) {

                    uvContainer.css("background-color", "rgb(209, 16, 16)");

                } else {

                    uvContainer.css("background-color", "rgb(178, 67, 156)");

                }
            })

        })

    }

    // function that executes Ajax call for 5 day weather forecast
    function fiveDayWeather() {

        queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET",
            error: function() {
                return;
            }
        }).then(function(response) {
            $("#five-day-forecast").empty();
            $("h4").text("5-day Forecast:");
            for (j = 0; j < response.list.length; j++) {

                // gets date & time of 5 day forecast data
                var timeDate = response.list[j].dt_txt;
                // selects first 2 digits of time of 5 day forecast data
                var trimTime = timeDate.slice(11,13);
                // gets time zone UTC offset
                var timeZone = (response.city.timezone) / 3600;
                // gets weather data at noon based on time zone
                var timeZoneNoon = 12 - timeZone;

                timeZoneNoon = Math.ceil(timeZoneNoon/3.0) * 3;
            
                if (trimTime == timeZoneNoon) {

                    // creates div tag to hold 5 day forecast card
                    var newCard = $("<div>");
                    // creates five day forecast date tag
                    var fiveDayDate = $("<h6>");
                    // creates five day forecast weather icon tag
                    var fiveDayImg = $("<img>");
                    // creates five day forecast temperature tag
                    var fiveDayTemp = $("<p>");
                    // creates five day forecast humidity tag
                    var fiveDayHum = $("<p>");
                    // converts 5 day forecast temp from Kelvin to Fahrenheit w/ 2 decimal points
                    var tempF = (((response.list[j].main.temp-273.15)*1.8)+32).toFixed(2);
                    // gets 5 day forecast weather icon ID
                    var forecast = response.list[j].weather[0].icon;
                    // uses weather icon ID to retrieve weather icon image file
                    var forecastIcon = "https://openweathermap.org/img/wn/" + forecast + ".png";
                    fiveDay = timeDate.slice(8, 10);
                    fiveMonth = timeDate.slice(5, 7);
                    fiveYear = timeDate.slice(0, 4);

                    if (fiveMonth.charAt(0) == 0) {

                        fiveMonth = fiveMonth.substring(1);
            
                    }

                    if (fiveDay.charAt(0) == 0) {

                        fiveDay = fiveDay.substring(1);
            
                    }

                    newCard.addClass("card text-white bg-info");
                    fiveDayDate.addClass("card-title");
                    fiveDayImg.addClass("card-img");
                    fiveDayTemp.addClass("card-text");
                    fiveDayHum.addClass("card-text");

                    fiveDayDate.text(fiveMonth + "/" + fiveDay + "/" + fiveYear);
                    fiveDayImg.attr("src", forecastIcon);
                    fiveDayTemp.text("Temp: " + tempF + " \xB0F");
                    fiveDayHum.text("Humidity: " + response.list[j].main.humidity + "%");

                    $("#five-day-forecast").append(newCard);
                    newCard.append(fiveDayDate);
                    newCard.append(fiveDayImg);
                    newCard.append(fiveDayTemp);
                    newCard.append(fiveDayHum);

                }

            }

        })

    }

    // Adds array brackets if array empty, else runs display buttons function
    if (cityArr === null) {

        cityArr = [];

    } else {

        displayBtns();

    }
    
    // Validates city searched on form submission, supplies Ajax call with valid city name, updates city array and displays buttons
    $("form").on("submit", function(event) {

        event.preventDefault();

        city = $("input").val().trim();

        todayWeather();

        fiveDayWeather();

        setTimeout(function() {

            console.log(failed);

            if (failed === false) {

                cityArr.push(city);

                localStorage.setItem("Cities", JSON.stringify(cityArr));

                // append button to aside
                displayBtns();

            }

        }, 250);

        $("input").val("");

    })

    // Retrieves user-selected city button content and runs Ajax calls
    $(".city-buttons").on("click", function() {

        city = $(this).attr("data-name");

        todayWeather();

        fiveDayWeather();

    })

    // Allows for city button selection and removal for buttons generated after initial page load
    $("#button-container").on("click", function(event) {

        if(event.target.matches("button")) {

            city = event.target.dataset.name;

            todayWeather();

            fiveDayWeather();

        } else if (event.target.matches("i")) {

            event.target.closest("button").remove();

            cityIndex = cityArr.indexOf(event.target.dataset.name);

            cityArr.splice(cityIndex, 1);

            localStorage.setItem("Cities", JSON.stringify(cityArr));

        }

    })

    // Clears all city buttons and local storage upon selection
    $("#button-clear").on("click", function() {

        localStorage.clear();

        $("#button-container").empty();

        location.reload();

    })

    // Removes user-selected city button and updates city array
    $(".fa-times").on("click", function(event) {

        event.stopPropagation();

        $(this).closest("button").remove();

        cityIndex = cityArr.indexOf($(this).attr("data-name"));

        cityArr.splice(cityIndex, 1);

        localStorage.setItem("Cities", JSON.stringify(cityArr));

    })

})