import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as WeatherActions from './weather.actions';
import { WeatherService } from './service/weather.service';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';

@Injectable()
export class WeatherEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeatherActions.initWeather),
      exhaustMap((_) => {
        return this.weatherService.getMainLocation().pipe(
          map((location) => WeatherActions.loadMainLocationSuccess({ location })),
          catchError((error) => of(WeatherActions.loadMainLocationFailure({ error: error.error.message })))
        );
      })
    );
  });

  loadWeather$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeatherActions.loadWeather, WeatherActions.loadMainLocationSuccess, WeatherActions.saveMainLocationSuccess),
      filter((action) => !!action.location),
      exhaustMap((action) => {
        return this.weatherService.getWeatherForLocation(action.location as string).pipe(
          map((weather) => WeatherActions.loadWeatherSuccess({ weather })),
          catchError((error) => of(WeatherActions.loadWeatherFailure({ error: error.error.message })))
        );
      })
    );
  });

  saveMainLocation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeatherActions.saveMainLocation),
      exhaustMap((action) => {
        return this.weatherService.saveMainLocation(action.location).pipe(
          map((location) => WeatherActions.saveMainLocationSuccess({ location })),
          catchError((error) => of(WeatherActions.saveMainLocationFailure({ error: error.error.message })))
        );
      })
    );
  });

  constructor(private readonly actions$: Actions, private weatherService: WeatherService) {}
}
