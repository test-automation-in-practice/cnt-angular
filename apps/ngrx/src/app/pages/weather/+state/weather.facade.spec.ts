import { WeatherFacade } from './weather.facade';
import { Store, StoreModule } from '@ngrx/store';
import { WEATHER_FEATURE_KEY, weatherReducer } from './weather.reducer';
import { EffectsModule } from '@ngrx/effects';
import { WeatherEffects } from './weather.effects';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from '../service/weather.service';
import { environment } from '../../../../environments/environment';
import { WeatherLocation } from '@cntws/weather';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getMainLocation, getWeather, getWeatherError, getWeatherLoaded } from './weather.selectors';
import { initWeather, loadWeather, saveMainLocation } from './weather.actions';
import { ApiModelGenerators, toPromise } from '@cntws/testing';

describe('WeatherFacade', () => {
  describe('integrative testing', () => {
    let facade: WeatherFacade;
    let store: Store;
    let controller: HttpTestingController;

    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forFeature(WEATHER_FEATURE_KEY, weatherReducer), EffectsModule.forFeature([WeatherEffects])],
        providers: [WeatherFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule, HttpClientTestingModule],
        providers: [WeatherService],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(WeatherFacade);
      controller = TestBed.inject(HttpTestingController);
    });

    async function readStateSnapshot() {
      const loaded = await toPromise(facade.loaded$);
      const error = await toPromise(facade.error$);
      const weather = await toPromise(facade.weather$);
      const mainLocation = await toPromise(facade.mainLocation$);
      return Promise.resolve({
        loaded,
        error,
        weather,
        mainLocation,
      });
    }

    describe('initializing the state', () => {
      describe('with a main location', () => {
        describe('and weather for that location', () => {
          it('should update the state without an error', async () => {
            facade.init();

            const location = 'Stuttgart';
            const firstRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
            firstRequest.flush(ApiModelGenerators.createLocationApiModel(location));
            const temp = 25;
            const weather = ApiModelGenerators.createWeatherApiModel(location, temp);
            const secondRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
            secondRequest.flush(weather);

            const expectedWeather: WeatherLocation[] = [{ id: weather[0].id, location, temp }];

            const state = await readStateSnapshot();
            const expectedState = {
              weather: expectedWeather,
              loaded: true,
              error: null,
              mainLocation: location,
            };
            expect(state).toEqual(expectedState);
          });
        });

        describe('and an error while loading the weather', () => {
          it('should set the error state', async () => {
            facade.init();

            const location = 'Stuttgart';
            const firstRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
            firstRequest.flush(ApiModelGenerators.createLocationApiModel(location));
            const secondRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
            const message = 'Error message';
            secondRequest.flush({ message }, { status: 500, statusText: message });

            const state = await readStateSnapshot();
            const expectedState = {
              weather: [],
              loaded: true,
              error: message,
              mainLocation: location,
            };
            expect(state).toEqual(expectedState);
          });
        });
      });

      describe('with an error loading the main location', () => {
        it('should set the error state', async () => {
          facade.init();

          const firstRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
          const message = 'Error message';
          firstRequest.flush({ message }, { status: 500, statusText: message });

          const state = await readStateSnapshot();
          const expectedState = {
            weather: [],
            loaded: true,
            error: message,
            mainLocation: undefined,
          };
          expect(state).toEqual(expectedState);
        });
      });
    });

    describe('loading weather for a location', () => {
      describe('without receiving an error', () => {
        it('should set the weather state', async () => {
          const location = 'Stuttgart';
          facade.loadWeatherForLocation(location);

          const temp = 25;
          const weather = ApiModelGenerators.createWeatherApiModel(location, temp);
          const firstRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
          firstRequest.flush(weather);

          const expectedWeather: WeatherLocation[] = [{ id: weather[0].id, location, temp }];

          const state = await readStateSnapshot();
          const expectedState = {
            weather: expectedWeather,
            loaded: true,
            error: null,
            mainLocation: undefined,
          };
          expect(state).toEqual(expectedState);
        });
      });

      describe('when receiving an error', () => {
        it('should set the error state', async () => {
          const location = 'Stuttgart';
          facade.loadWeatherForLocation(location);

          const firstRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
          const message = 'Error message';
          firstRequest.flush({ message }, { status: 500, statusText: message });

          const state = await readStateSnapshot();
          const expectedState = {
            weather: [],
            loaded: true,
            error: message,
            mainLocation: undefined,
          };
          expect(state).toEqual(expectedState);
        });
      });
    });

    describe('saving the main location', () => {
      describe('if no error occurs', () => {
        it('should set the main location and load the weather for the location', async () => {
          const location = 'Stuttgart';
          facade.saveMainLocation(location);

          const firstRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
          firstRequest.flush(ApiModelGenerators.createLocationApiModel(location));
          const temp = 25;
          const weather = ApiModelGenerators.createWeatherApiModel(location, temp);
          const secondRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
          secondRequest.flush(weather);

          const expectedWeather: WeatherLocation[] = [{ id: weather[0].id, location, temp }];

          const state = await readStateSnapshot();
          const expectedState = {
            weather: expectedWeather,
            loaded: true,
            error: null,
            mainLocation: location,
          };
          expect(state).toEqual(expectedState);
        });
      });

      describe('if an error occurs', () => {
        it('should set the error state', async () => {
          const location = 'Stuttgart';
          facade.saveMainLocation(location);

          const firstRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
          const message = 'Error message';
          firstRequest.flush({ message }, { status: 500, statusText: message });

          const state = await readStateSnapshot();
          const expectedState = {
            weather: [],
            loaded: true,
            error: message,
            mainLocation: undefined,
          };
          expect(state).toEqual(expectedState);
        });
      });
    });
  });

  describe('isolated testing', () => {
    let facade: WeatherFacade;
    let store: MockStore;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockStore(), WeatherFacade],
      });

      facade = TestBed.inject(WeatherFacade);
      store = TestBed.inject(MockStore);
    });

    describe('accessing data', () => {
      test.each([[true], [false]])('should provide the loaded state if it is %p', async (expected) => {
        store.overrideSelector(getWeatherLoaded, expected);
        store.refreshState();
        const loaded = await toPromise(facade.loaded$);
        expect(loaded).toBe(expected);
      });

      it('should provide the loaded weather', async () => {
        const weather = [{ id: 1, location: 'Stuttgart', temp: 25 }];
        store.overrideSelector(getWeather, weather);
        store.refreshState();
        const result = await toPromise(facade.weather$);
        expect(result).toEqual(weather);
      });

      it('should provide the main location', async () => {
        const mainLocation = 'Stuttgart';
        store.overrideSelector(getMainLocation, mainLocation);
        store.refreshState();
        const result = await toPromise(facade.mainLocation$);
        expect(result).toEqual(mainLocation);
      });

      it('should provide the current error', async () => {
        const error = 'this is an error';
        store.overrideSelector(getWeatherError, error);
        store.refreshState();
        const result = await toPromise(facade.error$);
        expect(result).toEqual(error);
      });
    });

    describe('manipulating data', () => {
      it('should dispatch the init weather action on init', () => {
        jest.spyOn(store, 'dispatch');
        facade.init();
        expect(store.dispatch).toHaveBeenCalledWith(initWeather());
      });

      it('should dispatch the load weather action on loading the weather for a location', () => {
        const location = 'Stuttgart';
        jest.spyOn(store, 'dispatch');
        facade.loadWeatherForLocation(location);
        expect(store.dispatch).toHaveBeenCalledWith(loadWeather({ location }));
      });

      it('should dispatch the save main location action on saving the main location', () => {
        const location = 'Stuttgart';
        jest.spyOn(store, 'dispatch');
        facade.saveMainLocation(location);
        expect(store.dispatch).toHaveBeenCalledWith(saveMainLocation({ location }));
      });
    });
  });
});
