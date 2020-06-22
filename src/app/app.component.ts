import { Component } from '@angular/core';
import axios from 'axios';
import { data } from './data.json';
import * as Skycons from 'skycons';
// import Jungla from '@jungla/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  searchLocation = '';
  loaded = false;
  loadedWeather = {};
  hourlyWeather = null;
  // I am using this as naturally darksky does not allow the localhost origin...
  corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
  // Normally this would be in a dot.env or something.
  apiKey = 'a371aba7516d8ea55de6d6e7fb411308';
  useCelsius = true;

  async locationEntry(e: any) {
    this.searchLocation =
      e.target.value.charAt(0).toUpperCase() +
      e.target.value.slice(1, e.target.value.length);

    e.target.value = '';
    // let geo = await axios(
    //   `${this.corsAnywhere}https://darksky.net/geo?q=${this.searchLocation}`
    // );
    // let weather = await axios(
    //   `${this.corsAnywhere}https://api.darksky.net/forecast/${this.apiKey}/${geo.data.latitude},${geo.data.longitude}`
    // );

    this.loadedWeather = data.daily.data;
    // this.loadedWeather = weather.data.daily.data;
    // Getting 13 hours... as the first hour is the current hour.
    this.hourlyWeather = data.hourly.data.slice(0, 12);
    this.loaded = true;
  }

  convertTemp(temp: number): number {
    return this.useCelsius
      ? Math.floor(((temp - 32) * 5) / 9)
      : Math.floor(temp);
  }

  getDay(offset: number) {
    return offset === 0
      ? 'Today'
      : offset === 1
      ? 'Tomorrow'
      : new Date(
          new Date().getTime() + offset * 24 * 60 * 60 * 1000
        ).toLocaleString('en-us', {
          weekday: 'long',
        });
  }

  getSunSetRiseTime(time: number) {
    console.log('new');
    var eventTime = new Date(time * 1000);
    console.log(eventTime);
    return (
      (eventTime.getHours() < 10 ? '0' : '') +
      (eventTime.getHours() % 12) +
      ':' +
      (eventTime.getMinutes() < 10 ? '0' : '') +
      eventTime.getMinutes() +
      (eventTime.getHours() < 12 ? ' am' : ' pm')
    );
  }

  getWeatherType(name: string) {
    let result = name.split('-');
    result = result.filter((word) => word !== 'night' && word !== 'day');
    result = result.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1, word.length)
    );
    return result.join(' ');
  }

  getWeatherIcon(name: string) {
    console.log(Skycons);
    return Skycons['WIND'];
  }

  getCurrentTime() {
    var today = new Date();
    return (
      (today.getHours() < 10 ? '0' : '') +
      (today.getHours() % 12) +
      ':' +
      (today.getMinutes() < 10 ? '0' : '') +
      today.getMinutes() +
      (today.getHours() < 12 ? ' am' : ' pm')
    );
  }

  getHour(time: number): string {
    let eventTime = new Date(time * 1000);
    return (
      (eventTime.getHours() % 12 === 0 ? 12 : eventTime.getHours() % 12) +
      (eventTime.getHours() < 12 ? ' am' : ' pm')
    );
  }
}
