import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import * as WeatherActions from "./weather.actions";
import { WeatherService } from "../service/weather.service";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable()
export class WeatherEffects {
  init$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(WeatherActions.initWeather),
        exhaustMap((action) => {
          return this.weatherService.getMainLocation().pipe(
            map(locationname => WeatherActions.loadMainLocationSuccess({ locationname })),
            catchError(error => of(WeatherActions.loadMainLocationFailure({message: error.error.message})))
          )
        })
      );
    }
  );

  loadWeather$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeatherActions.loadWeather),
      exhaustMap((action) => {
        return this.weatherService.getWeatherForLocation(action.location).pipe(
          map(weather => WeatherActions.loadWeatherSuccess({ weather })),
          catchError(error => of(WeatherActions.loadWeatherFailure({message: error.error.message})))
        )
      })
    );
  });

  saveWeatherLocation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeatherActions.saveDefaultLocation),
      exhaustMap((action) => {
        return this.weatherService.saveMainLocation(action.location).pipe(
          map(location => WeatherActions.saveDefaultLocationSuccess({ location })),
          catchError(error => of(WeatherActions.saveDefaultLocationFailure({message: error.error.message})))
        )
      })
    );
  });

  constructor(private readonly actions$: Actions, private weatherService: WeatherService) {}
}
