import { WEATHER_FEATURE_KEY, weatherAdapter, WeatherState } from './weather.reducer';
import { getMainLocation, getWeather, getWeatherError, getWeatherLoaded } from './weather.selectors';
import { WeatherLocation } from '@cntws/weather';

describe('Weather Selectors', () => {
  describe('for checking if the weather was loaded', () => {
    test.each([[true], [false]])('should return the appropriate state if it is %p', (loaded: boolean) => {
      const parentState: { [WEATHER_FEATURE_KEY]: WeatherState } = {
        weather: weatherAdapter.getInitialState({
          loaded,
        }),
      };

      const result = getWeatherLoaded(parentState);
      expect(result).toEqual(loaded);
    });
  });

  describe('for reading the current error', () => {
    test.each([['A error is present'], [undefined]])('should be able to return the following value: %p', (error) => {
      const parentState: { [WEATHER_FEATURE_KEY]: WeatherState } = {
        weather: weatherAdapter.getInitialState({
          loaded: true,
          error,
        }),
      };

      const result = getWeatherError(parentState);
      expect(result).toEqual(error);
    });
  });

  describe('for reading the loaded weather', () => {
    const noWeatherResults: WeatherLocation[] = [];
    const oneWeatherResult: WeatherLocation[] = [{ id: 1, temp: 25, location: 'Stuttgart' }];
    const multipleWeatherResults: WeatherLocation[] = [
      { id: 1, temp: 25, location: 'Stuttgart' },
      { id: 2, temp: 21, location: 'Tübingen' },
      { id: 3, temp: 23, location: 'Freiburg' },
    ];

    test.each([
      { results: noWeatherResults, length: noWeatherResults.length },
      { results: oneWeatherResult, length: oneWeatherResult.length },
      { results: multipleWeatherResults, length: multipleWeatherResults.length },
    ])('should be able to read $length weather results', ({ results }) => {
      const weatherState = weatherAdapter.getInitialState({
        loaded: true,
      });
      const resultState = weatherAdapter.addMany(results, weatherState);
      const parentState: { [WEATHER_FEATURE_KEY]: WeatherState } = {
        weather: resultState,
      };

      const result = getWeather(parentState);
      expect(result).toEqual(results);
    });
  });

  describe('for reading the main location', () => {
    test.each([
      ['Stuttgart', 'Stuttgart'],
      [null, null],
    ])('shoud result in %p if %p is given', (expected, mainLocation) => {
      const parentState: { [WEATHER_FEATURE_KEY]: WeatherState } = {
        weather: weatherAdapter.getInitialState({
          loaded: true,
          mainLocation,
        }),
      };

      const result = getMainLocation(parentState);
      expect(result).toEqual(expected);
    });
  });
});
