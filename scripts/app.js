const app = Vue.createApp({
    data() {
        return {
            user: {
                firstName: "",
                lastName: "",
                age: "",
                avatar: ""
            },
            weather: {
                city: "London",
                province: "Ontario",
                country: "Canada",
                temperature: "",
                wind: "",
                description: ""
            },

            dictionary: {
            word: "",
            phonetic: "",
            definition: ""
            }
        };
    },

    methods: {
        async getRandomUser() {
            try {
                const response = await fetch("https://randomuser.me/api/");
                const data = await response.json();
                const person = data.results[0];

                this.user.firstName = person.name.first;
                this.user.lastName = person.name.last;
                this.user.age = person.dob.age;
                this.user.avatar = person.picture.large;
            } catch (error) {
                console.log("Random User Error:", error);
            }
        },
        async getWeather() {
            try {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.weather.city}&count=1&language=en&format=json`;

                const geoResponse = await fetch(geoUrl);
                const geoData = await geoResponse.json();

                console.log("Geocoding Data:", geoData);

                const latitude = geoData.results[0].latitude;
                const longitude = geoData.results[0].longitude;

                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`;

                const weatherResponse = await fetch(weatherUrl);
                const weatherData = await weatherResponse.json();

                console.log("Weather Data:", weatherData);

                this.weather.temperature = weatherData.current.temperature_2m + " °C";
                this.weather.wind = weatherData.current.wind_speed_10m + " km/h";
                this.weather.description = this.getWeatherDescription(weatherData.current.weather_code);

            } catch (error) {
                console.log("Weather Error:", error);
            }
        },

        getWeatherDescription(code) {
            if (code === 0) return "Clear sky";
            else if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
            else if (code === 45 || code === 48) return "Fog";
            else if (code === 51 || code === 53 || code === 55) return "Drizzle";
            else if (code === 61 || code === 63 || code === 65) return "Rain";
            else if (code === 71 || code === 73 || code === 75) return "Snow";
            else if (code === 95) return "Thunderstorm";
            else return "Unknown";
        },
        async getDefinition() {
        try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.dictionary.word}`);
        const data = await response.json();

        console.log("Dictionary Data:", data);

        this.dictionary.word = data[0].word;
        this.dictionary.phonetic = data[0].phonetic || "N/A";
        this.dictionary.definition = data[0].meanings[0].definitions[0].definition;
    } catch (error) {
        console.log("Dictionary Error:", error);
    }
}

    },

    mounted() {
        this.getRandomUser();
        this.getWeather();
    }
});

app.mount("#app");