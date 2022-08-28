import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as WeatherActions from './weather.actions';
import { WeatherLocation } from '@cntws/weather';

export const WEATHER_FEATURE_KEY = 'weather';

export interface WeatherState extends EntityState<WeatherLocation> {
  loaded: boolean; // has the Weather list been loaded
  error?: string | null; // last known error (if any)
  mainLocation?: string | null;
}

export const weatherAdapter: EntityAdapter<WeatherLocation> = createEntityAdapter<WeatherLocation>();

export const initialWeatherState: WeatherState = weatherAdapter.getInitialState({
  loaded: false,
});

const reducer = createReducer(
  initialWeatherState,
  on(WeatherActions.initWeather, (state) => ({ ...state, loaded: false, error: null })),
  on(WeatherActions.loadMainLocationSuccess, (state, { location }) => ({ ...state, loaded: true, error: null, mainLocation: location })),
  on(WeatherActions.loadWeatherSuccess, (state, { weather }) => weatherAdapter.setAll(weather, { ...state, loaded: true, error: null })),
  on(WeatherActions.saveMainLocationSuccess, (state, { location }) => ({ ...state, loaded: true, error: null, mainLocation: location })),
  on(WeatherActions.loadWeatherFailure, (state, { error }) => weatherAdapter.setAll([], { ...state, error: error, loaded: true })),
  on(WeatherActions.saveMainLocationFailure, (state, { error }) => weatherAdapter.setAll([], { ...state, error: error, loaded: true })),
  on(WeatherActions.loadMainLocationFailure, (state, { error }) => weatherAdapter.setAll([], { ...state, error: error, loaded: true }))
);

export function weatherReducer(state: WeatherState | undefined, action: Action) {
  return reducer(state, action);
}
