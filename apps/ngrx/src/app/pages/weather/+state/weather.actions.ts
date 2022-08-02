import { createAction, props } from "@ngrx/store";
import { WeatherLocation } from "@cntws/weather";

export const initWeather = createAction('[Weather Page] Init');

export const loadMainLocationSuccess = createAction('[Weather/API] Load main location success', props<{locationname: string}>());

export const loadMainLocationFailure = createAction('[Weather/API] Load main location failure', props<{ message: string }>());

export const loadWeatherSuccess = createAction('[Weather/API] Load Weather Success', props<{ weather: WeatherLocation[] }>());

export const loadWeatherFailure = createAction('[Weather/API] Load Weather Failure', props<{ message: string }>());

export const loadWeather = createAction('[Weather/API] Load Weather for location', props<{ location: string}>());

export const saveDefaultLocation = createAction('[Weather/API] Save default location', props<{ location: string}>());

export const saveDefaultLocationSuccess = createAction('[Weather/API] Save default location success', props<{ location: string }>());

export const saveDefaultLocationFailure = createAction('[Weather/API] Save default location failure', props<{ message: string }>());
