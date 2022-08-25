import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as WeatherActions from './weather.actions';
import * as WeatherSelectors from './weather.selectors';

@Injectable()
export class WeatherFacade {
  loaded$ = this.store.pipe(select(WeatherSelectors.getWeatherLoaded));
  weather$ = this.store.pipe(select(WeatherSelectors.getWeather));
  mainLocation$ = this.store.pipe(select(WeatherSelectors.getMainLocation));
  error$ = this.store.pipe(select(WeatherSelectors.getWeatherError));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(WeatherActions.initWeather());
  }

  loadWeatherForLocation(location: string) {
    this.store.dispatch(WeatherActions.loadWeather({ location }));
  }

  saveMainLocation(location: string) {
    this.store.dispatch(WeatherActions.saveMainLocation({ location }));
  }
}
