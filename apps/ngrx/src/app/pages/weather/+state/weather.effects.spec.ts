import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { WeatherEffects } from './weather.effects';
import { WeatherService } from './service/weather.service';
import {
  initWeather,
  loadMainLocationFailure,
  loadMainLocationSuccess,
  loadWeather,
  loadWeatherFailure,
  loadWeatherSuccess,
  saveMainLocation,
  saveMainLocationFailure,
  saveMainLocationSuccess,
} from './weather.actions';
import { cold, hot } from 'jasmine-marbles';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherLocation } from '@cntws/weather';

describe('WeatherEffects', () => {
  let actions: Observable<Action>;
  let effects: WeatherEffects;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherEffects, provideMockActions(() => actions), provideMockStore(), WeatherService],
    });
    service = TestBed.inject(WeatherService);
    effects = TestBed.inject(WeatherEffects);
  });

  describe('receiving the initialization action', () => {
    it('should return the main location if the service has no error', () => {
      const action = initWeather();
      actions = hot('-a', { a: action });

      const locationname = 'stuttgart';
      const serviceResult = cold('-a|', { a: locationname });
      jest.spyOn(service, 'getMainLocation').mockReturnValue(serviceResult);

      const resultAction = loadMainLocationSuccess({ location: locationname });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.init$).toBeObservable(expectedResult);
    });

    it('should return the error if the service has an error', () => {
      const action = initWeather();
      actions = hot('-a', { a: action });

      const message = 'An error message';
      const error = {
        error: { message },
      };
      const serviceResult = cold('-#|', {}, error);
      jest.spyOn(service, 'getMainLocation').mockReturnValue(serviceResult);

      const resultAction = loadMainLocationFailure({ error: message });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.init$).toBeObservable(expectedResult);
    });
  });

  describe('receiving an action to load the weather', () => {
    test.each([
      [loadWeather({ location: 'Stuttgart' })],
      [loadMainLocationSuccess({ location: 'Stuttgart' })],
      [saveMainLocationSuccess({ location: 'Stuttgart' })],
    ])('should return the loaded weather if the service has no error for the action %s', (action) => {
      actions = hot('-a', { a: action });

      const weather: WeatherLocation[] = [{ id: 1, temp: 25, location: 'Stuttgart' }];
      const serviceResult = cold('-a|', { a: weather });
      jest.spyOn(service, 'getWeatherForLocation').mockReturnValue(serviceResult);

      const resultAction = loadWeatherSuccess({ weather });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.loadWeather$).toBeObservable(expectedResult);
    });

    test.each([
      [loadWeather({ location: 'Stuttgart' })],
      [loadMainLocationSuccess({ location: 'Stuttgart' })],
      [saveMainLocationSuccess({ location: 'Stuttgart' })],
    ])('should return the error if the service has an error for the action %s', (action) => {
      actions = hot('-a', { a: action });

      const message = 'An error message';
      const error = {
        error: { message },
      };
      const serviceResult = cold('-#|', {}, error);
      jest.spyOn(service, 'getWeatherForLocation').mockReturnValue(serviceResult);

      const resultAction = loadWeatherFailure({ error: message });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.loadWeather$).toBeObservable(expectedResult);
    });
  });

  describe('receiving the save main location action', () => {
    it('should return the saved location if the service has no error', () => {
      const location = 'Stuttgart';
      const action = saveMainLocation({ location: location });
      actions = hot('-a', { a: action });

      const serviceResult = cold('-a|', { a: location });
      jest.spyOn(service, 'saveMainLocation').mockReturnValue(serviceResult);

      const resultAction = saveMainLocationSuccess({ location });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.saveMainLocation$).toBeObservable(expectedResult);
    });

    it('should return the error if the service has an error', () => {
      const location = 'Stuttgart';
      const action = saveMainLocation({ location: location });
      actions = hot('-a', { a: action });

      const message = 'An error message';
      const error = {
        error: { message },
      };
      const serviceResult = cold('-#|', {}, error);
      jest.spyOn(service, 'saveMainLocation').mockReturnValue(serviceResult);

      const resultAction = saveMainLocationFailure({ error: message });
      const expectedResult = cold('--a', { a: resultAction });

      expect(effects.saveMainLocation$).toBeObservable(expectedResult);
    });
  });
});
