import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { LocationApiModel, WeatherApiModel, WeatherLocation } from '@cntws/weather';

@Injectable()
export class WeatherService {
  static ENDPOINTS = {
    mainLocation: () => `${environment.weatherApi}/mainLocation`,
    queryLocation: (location: string) => `${environment.weatherApi}/locations?q=${location}`,
  };

  constructor(private http: HttpClient) {}

  private static mapApiModel(apiModel: WeatherApiModel[]): WeatherLocation[] {
    return apiModel.map((apiWeather) => ({ temp: apiWeather.temp, location: apiWeather.name, id: apiWeather.id }));
  }

  getMainLocation(): Observable<string> {
    return this.http
      .get<LocationApiModel>(WeatherService.ENDPOINTS.mainLocation())
      .pipe(map(loc => loc.name));
  }

  getWeatherForLocation(location: string): Observable<WeatherLocation[]> {
    return this.http
      .get<WeatherApiModel[]>(WeatherService.ENDPOINTS.queryLocation(location))
      .pipe(map(WeatherService.mapApiModel));
  }

  saveMainLocation(location: string): Observable<string> {
    return this.http
      .post<LocationApiModel>(WeatherService.ENDPOINTS.mainLocation(), { name: location })
      .pipe(map(loc => loc.name));
  }
}
