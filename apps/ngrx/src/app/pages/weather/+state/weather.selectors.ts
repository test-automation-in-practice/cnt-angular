import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WEATHER_FEATURE_KEY, WeatherState, weatherAdapter } from './weather.reducer';

// Lookup the 'Weather' feature state managed by NgRx
export const getWeatherState = createFeatureSelector<WeatherState>(WEATHER_FEATURE_KEY);

const { selectAll, selectEntities } = weatherAdapter.getSelectors();

export const getWeatherLoaded = createSelector(getWeatherState, (state: WeatherState) => state.loaded);

export const getWeatherError = createSelector(getWeatherState, (state: WeatherState) => state.error);

export const getAllWeather = createSelector(getWeatherState, (state: WeatherState) => selectAll(state));

export const getWeatherEntities = createSelector(getWeatherState, (state: WeatherState) => selectEntities(state));

export const getMainLocation = createSelector(getWeatherState, (state: WeatherState) => state.mainLocation);
