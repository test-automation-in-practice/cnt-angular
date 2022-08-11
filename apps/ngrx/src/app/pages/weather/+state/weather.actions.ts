import { createAction, props } from "@ngrx/store";
import { WeatherLocation } from "@cntws/weather";

export const initWeather = createAction('[Weather Page] Init');

export const loadMainLocationSuccess = createAction('[Weather/API] Load main location success', props<{location: string}>());

export const loadMainLocationFailure = createAction('[Weather/API] Load main location failure', props<{ error: string }>());

export const loadWeatherSuccess = createAction('[Weather/API] Load Weather Success', props<{ weather: WeatherLocation[] }>());

export const loadWeatherFailure = createAction('[Weather/API] Load Weather Failure', props<{ error: string }>());

export const loadWeather = createAction('[Weather/API] Load Weather for location', props<{ location: string}>());

export const saveMainLocation = createAction('[Weather/API] Save default location', props<{ location: string}>());

export const saveMainLocationSuccess = createAction('[Weather/API] Save default location success', props<{ location: string }>());

export const saveMainLocationFailure = createAction('[Weather/API] Save default location failure', props<{ error: string }>());
