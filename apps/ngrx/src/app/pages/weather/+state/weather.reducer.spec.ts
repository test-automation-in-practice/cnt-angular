import { weatherAdapter, weatherReducer } from './weather.reducer';
import {
  initWeather, loadMainLocationFailure,
  loadMainLocationSuccess, loadWeatherFailure,
  loadWeatherSuccess, saveMainLocationFailure,
  saveMainLocationSuccess
} from './weather.actions';

describe('Weather Reducer', () => {

  describe('initializing weather ', () => {
    it('should set modify the loaded and error state', () => {
      const state = weatherAdapter.getInitialState({
        loaded: true,
        error: 'An error message'
      });
      const result = weatherReducer(state, initWeather());
      expect(result).toEqual(expect.objectContaining({
        loaded: false,
        error: null
      }));
    });
  });

  describe('retrieving success on loading a main location', () => {
    it('should set the loaded, error and main location state', () => {
      const state = weatherAdapter.getInitialState({
        loaded: false,
        error: 'An error message'
      });
      const locationname = 'Stuttgart';
      const result = weatherReducer(state, loadMainLocationSuccess({ location: locationname }));
      expect(result).toEqual(expect.objectContaining({
        loaded: true,
        error: null,
        mainLocation: locationname
      }));
    });
  });

  describe('retrieving success on loading weather data', () => {
    it('should set the loaded, error and weather data state', () => {
      const state = weatherAdapter.getInitialState({
        loaded: false,
        error: 'An error message'
      });
      const weatherInStuttgart = { id: 1, location: 'Stuttgart', temp: 25 };
      const weatherInFreiburg = { id: 2, location: 'Freiburg', temp: 23 };
      const weather = [weatherInStuttgart, weatherInFreiburg];
      const result = weatherReducer(state, loadWeatherSuccess({ weather }));
      expect(result).toEqual(expect.objectContaining({
        loaded: true,
        error: null,
        entities: {
          1: weatherInStuttgart,
          2: weatherInFreiburg
        }
      }));
    });
  });

  describe('retrieving success on saving the default location', () => {
    it('should set loaded, error and main location state', () => {
      const state = weatherAdapter.getInitialState({
        loaded: false,
        error: 'An error message'
      });
      const location = 'Stuttgart';
      const result = weatherReducer(state, saveMainLocationSuccess({ location }));
      expect(result).toEqual(expect.objectContaining({
        loaded: true,
        error: null,
        mainLocation: location
      }));
    });
  });

  describe('getting an error', () => {
    test.each([
      { name: 'weather', error: 'an error message', actionFactory: loadWeatherFailure },
      { name: 'default location', error: 'an error message', actionFactory: saveMainLocationFailure },
      { name: 'main location', error: 'an error message', actionFactory: loadMainLocationFailure }
    ])('on loading $name should set error and loaded state', ({ error, actionFactory }) => {
      const state = weatherAdapter.getInitialState({
        loaded: false
      });
      const result = weatherReducer(state, actionFactory({ error }));
      expect(result).toEqual(expect.objectContaining({
        loaded: true,
        error
      }));
    });
  });
});
