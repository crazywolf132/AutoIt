import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass', '../assets/css/weather-icons.min.css'],
})
export class AppComponent {
  // Used in the UI to show where the current weather report is for.
  searchLocation = '';
  // Used to display the error message when true.
  loaded = false;
  // Stores the 7 days of weather from darksky.
  loadedWeather = {};
  // Stores the 'currently' field of weather from darksky.
  currentWeather = null;
  // Stores the 'hourly' weather from darksky.
  hourlyWeather = null;
  // I am using this as naturally darksky does not allow the localhost origin...
  corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
  // Normally this would be in a dot.env or something.
  apiKey = 'a371aba7516d8ea55de6d6e7fb411308';
  // Used by the switch in the footer to change between celsius and fahrenheit
  useCelsius = true;

  locationEntry(e: any) {
    // We are cleaning up the search, so it has a capital first letter.
    // We are doing this because we are using it to display on the UI.
    this.searchLocation =
      e.target.value.charAt(0).toUpperCase() +
      e.target.value.slice(1, e.target.value.length);

    // Resetting the value to empty for the next search.
    e.target.value = '';

    // Calling the function to get the weather.
    this.getLocationWeather(true);
  }

  /**
   * Used to get all the weather information from the darksky API
   * @param {Boolean} useSearch
   * @param {Number} long
   * @param {Number} lat
   */
  async getLocationWeather(useSearch, long = '', lat = '') {
    // This is setup so if the browser geolocation ever did work... we could
    // use this one function for getting the weather... regardless of if it was
    // from the search-bar or the browser location.
    if (useSearch) {
      // We are hitting a darksky api for converting the word location to the
      // lat & long values.
      let geo = await axios(
        `${this.corsAnywhere}https://darksky.net/geo?q=${this.searchLocation}`
      );
      // Using the lat & long from the returned results.
      long = geo.data.longitude;
      lat = geo.data.latitude;
    }
    // Making the call to darksky api to get all the information about the weather.
    let weather = await axios(
      `${this.corsAnywhere}https://api.darksky.net/forecast/${this.apiKey}/${lat},${long}`
    );

    // We are changing the loadedWeather to show the days from 'tomorrow' to the 7th day.
    // This is due to use keeping the currentWeather separately.
    this.loadedWeather = weather.data.daily.data.slice(
      1,
      weather.data.daily.data.length
    );

    // Pulling out the currentWeather separately.
    this.currentWeather = weather.data.currently;
    // Getting 13 hours... as the first hour is the current hour.
    this.hourlyWeather = weather.data.hourly.data.slice(0, 12);

    // Setting the loaded to true. This will change the ui from  showing an error message
    // to showing all the weather information.
    this.loaded = true;
  }

  // Using basic fahrenheit -> celsius converter.
  convertTemp(temp: number): number {
    return this.useCelsius
      ? Math.floor(((temp - 32) * 5) / 9)
      : Math.floor(temp);
  }

  /**
   * Function to return the day of the week or 'Tomorrow' if the offset is 1.
   * We add 1 to the offset because we are displaying 'today' in a different area.
   * @param {number} offset
   */
  getDay(offset: number) {
    // If the offset is 0, it is for tomorrow.
    return offset === 0
      ? 'Tomorrow'
      : new Date(
          new Date().getTime() + (offset + 1) * 24 * 60 * 60 * 1000
        ).toLocaleString('en-us', {
          weekday: 'long',
        });
  }

  /**
   *
   * @param {String} name
   */
  getWeatherType(name: string) {
    // We are splitting the name of the icon by the '-'.
    let result = name.split('-');
    // We are removing key words related to the time of day.
    result = result.filter((word) => word !== 'night' && word !== 'day');
    // We are now converting the words to have an uppercase first letter.
    result = result.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1, word.length)
    );

    // Combining the words with a space, and returning the result.
    return result.join(' ');
  }

  getWeatherIcon(name: string): string {
    // Working out what the darksky suggested icon is.
    // We are then returning the correct class-name for the icon library we are using.
    switch (name) {
      case 'clear-night':
        return 'wi-night-clear';
      case 'rain':
        return 'wi-rain-mix';
      case 'snow':
        return 'wi-snow';
      case 'sleet':
        return 'wi-sleet';
      case 'wind':
        return 'wi-strong-wind';
      case 'fog':
        return 'wi-fog';
      case 'cloudy':
        return 'wi-cloudy';
      case 'partly-cloudy-day':
        return 'wi-day-sunny-overcast';
      case 'partly-cloudy-night':
        return 'wi-night-partly-cloudy';
      case 'clear-day':
      default:
        // If all else fails... we will say it is going to be a sunny day.
        return 'wi-day-sunny';
    }
  }

  /**
   * Getting the current time and displaying it in the corner of the screen.
   *
   * We are basing this from the time provided by dark sky... though, if nothing
   * is provided... we are using the current system time.
   */
  getCurrentTime() {
    var today = new Date(
      this.currentWeather.time ? this.currentWeather.time * 1000 : null
    );
    return (
      (today.getHours() < 10 ? '0' : '') +
      (today.getHours() % 12) +
      ':' +
      (today.getMinutes() < 10 ? '0' : '') +
      today.getMinutes() +
      (today.getHours() < 12 ? ' am' : ' pm')
    );
  }

  /**
   * Used to return the hour of the day from the given unixepoch time.
   * This is used by the hourly view.
   * @param {Number} time
   */
  getHour(time: number): string {
    let eventTime = new Date(time * 1000);
    return (
      (eventTime.getHours() % 12 === 0 ? 12 : eventTime.getHours() % 12) +
      (eventTime.getHours() < 12 ? ' am' : ' pm')
    );
  }
}
