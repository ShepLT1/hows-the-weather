$(document).ready(function() {

    // Retrieve city names from local storage and display in aside
    var cityArr = JSON.parse(localStorage.getItem("Cities"));

    var city = "";

    var failed = false;

    var queryURL = "";

    var uvURL = "";

    var i = 4;

    var APIkey = "75c9c0e828f465579603124bb4099fec";

    var today = new Date();

    var fiveDay = "";

    var fiveMonth = "";

    var fiveYear = "";

    var date = {
        day: today.getDate(),
        month: (today.getMonth() +1),
        year: today.getUTCFullYear()
    }

    var todayDate = date.month + "/" + date.day + "/" + date.year;

    function displayBtns() {

        $("#button-container").empty();

        for (i=0; i<cityArr.length; i++) {

            var cityBtn = $("<button>");

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

            uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;

            var tempF = (((response.main.temp-273.15)*1.8)+32).toFixed(2);

            var forecast = response.weather[0].icon;

            var forecastIcon = "http://openweathermap.org/img/wn/" + forecast + ".png";

            var todayCityDate = $("<h3>");

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
                var uvVal = uvRes.value;
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
            for (i = 0; i < response.list.length; i++) {

                var timeDate = response.list[i].dt_txt;
                var trimTime = timeDate.slice(11,13);
                var timeZone = (response.city.timezone) / 3600;
                var timeZoneNoon = 12 - timeZone;

                timeZoneNoon = Math.ceil(timeZoneNoon/3.0) * 3;
            
                if (trimTime == timeZoneNoon) {

                    var newCard = $("<div>");
                    var fiveDayDate = $("<h6>");
                    var fiveDayImg = $("<img>");
                    var fiveDayTemp = $("<p>");
                    var fiveDayHum = $("<p>");
                    var tempF = (((response.list[i].main.temp-273.15)*1.8)+32).toFixed(2);
                    var forecast = response.list[i].weather[0].icon;
                    var forecastIcon = "http://openweathermap.org/img/wn/" + forecast + ".png";
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
                    fiveDayHum.text("Humidity: " + response.list[i].main.humidity + "%");

                    $("#five-day-forecast").append(newCard);
                    newCard.append(fiveDayDate);
                    newCard.append(fiveDayImg);
                    newCard.append(fiveDayTemp);
                    newCard.append(fiveDayHum);

                }

            }

        })

    }

    if (cityArr === null) {

        cityArr = [];

    } else {

        displayBtns();

    }
    
    $("form").on("submit", function(event) {

        event.preventDefault();

        // push city name to city name array and store in local storage
        city = $("input").val().trim();

        // Ajax call for today's weather forecast
        todayWeather();

        // Ajax call for 5 day forecast
        fiveDayWeather();

        setTimeout(function() {

            console.log(failed);

            if (failed === false) {

                cityArr.push(city);

                localStorage.setItem("Cities", JSON.stringify(cityArr));

                // append button to aside
                displayBtns();

            }

        }, 200);

        $("input").val("");

    })

    $(".city-buttons").on("click", function() {

        city = $(this).attr("data-name");

        todayWeather();

        fiveDayWeather();

    })

    $("#button-container").on("click", function(event) {

        if(event.target.matches("button")) {

            city = event.target.dataset.name;

            todayWeather();

            fiveDayWeather();

        } else if (event.target.matches("i")) {

            event.target.closest("button").remove();

        var cityIndex = cityArr.indexOf(event.target.dataset.name);

        cityArr.splice(cityIndex, 1);

        localStorage.setItem("Cities", JSON.stringify(cityArr));

        }

    })

    $("#button-clear").on("click", function() {

        localStorage.clear();

        $("#button-container").empty();

        location.reload();

    })

    $(".fa-times").on("click", function(event) {

        event.stopPropagation();

        $(this).closest("button").remove();

        var cityIndex = cityArr.indexOf($(this).attr("data-name"));

        cityArr.splice(cityIndex, 1);

        localStorage.setItem("Cities", JSON.stringify(cityArr));

    })

    // logs element that is clicked
    $( "*", document.body ).click(function( event ) {
        event.stopPropagation();
        var domElement = $( this ).get( 0 );
        console.log(domElement.nodeName);
      });

      
    $("div").click(function() {
        var colorClass = $(this).attr("id");
        console.log(colorClass);
    });

})