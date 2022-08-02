import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WEATHER_FEATURE_KEY, WeatherState, weatherAdapter } from './weather.reducer';

// Lookup the 'Weather' feature state managed by NgRx
export const getWeatherState = createFeatureSelector<WeatherState>(WEATHER_FEATURE_KEY);

const { selectAll } = weatherAdapter.getSelectors();

export const getWeatherLoaded = createSelector(getWeatherState, (state: WeatherState) => state.loaded);

export const getWeatherError = createSelector(getWeatherState, (state: WeatherState) => state.error);

export const getWeather = createSelector(getWeatherState, (state: WeatherState) => selectAll(state));

export const getMainLocation = createSelector(getWeatherState, (state: WeatherState) => state.mainLocation);
