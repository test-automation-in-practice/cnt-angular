import { Component } from "@angular/core";
import { WeatherLocation } from "@cntws/weather";
import { WeatherFacade } from "./+state/weather.facade";
import { map } from 'rxjs';

@Component({
  selector: 'cntws-weather-page',
  templateUrl: './weather-page.component.html',
  styleUrls: ['./weather-page.component.scss'],
})
export class WeatherPageComponent {
  weather$ = this.weather.weather$;
  warning$ = this.weather.error$;
  isLoading$ = this.weather.loaded$.pipe(map(l => !l));
  mainLocation$ = this.weather.mainLocation$;

  constructor(private weather: WeatherFacade) {
    this.weather.init();
  }

  search(location: string) {
    this.weather.loadWeatherForLocation(location);
  }

  saveLocation(location: WeatherLocation) {
    this.weather.saveMainLocation(location.location);
  }
}
