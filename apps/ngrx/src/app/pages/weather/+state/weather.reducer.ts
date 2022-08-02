import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";

import * as WeatherActions from "./weather.actions";
import { WeatherLocation } from "@cntws/weather";

export const WEATHER_FEATURE_KEY = 'weather';

export interface WeatherState extends EntityState<WeatherLocation> {
  loaded: boolean; // has the Weather list been loaded
  error?: string | null; // last known error (if any)
  mainLocation?: string | null;
}

export interface WeatherPartialState {
  readonly [WEATHER_FEATURE_KEY]: WeatherState;
}

export const weatherAdapter: EntityAdapter<WeatherLocation> = createEntityAdapter<WeatherLocation>();

export const initialWeatherState: WeatherState = weatherAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialWeatherState,
  on(WeatherActions.initWeather, (state) => ({ ...state, loaded: false, error: null })),
  on(WeatherActions.loadMainLocationSuccess, (state, {locationname}) => ({...state, loaded: true, error: null, mainLocation: locationname })),
  on(WeatherActions.loadWeatherSuccess, (state, { weather }) => weatherAdapter.setAll(weather, { ...state, loaded: true, error: null })),
  on(WeatherActions.saveDefaultLocationSuccess, (state, {location}) => ({...state, loaded: true, error: null, mainLocation: location })),
  on(WeatherActions.loadWeatherFailure, (state, { message }) => weatherAdapter.setAll([], { ...state, error: message })),
  on(WeatherActions.saveDefaultLocationFailure, (state, { message }) => weatherAdapter.setAll([], { ...state, error: message })),
  on(WeatherActions.loadMainLocationFailure, (state, { message }) => weatherAdapter.setAll([], { ...state, error: message })),
);

export function weatherReducer(state: WeatherState | undefined, action: Action) {
  return reducer(state, action);
}
