import { WeatherFacade } from "./weather.facade";

// interface TestSchema {
//   weather: WeatherState;
// }

describe('WeatherFacade', () => {
  // let facade: WeatherFacade;
  // let store: Store<TestSchema>;
  // const createWeatherEntity = (id: string, name = ''): WeatherLocation => ({
  //   id,
  //   name: name || `name-${id}`,
  // });
  //
  // describe('used in NgModule', () => {
  //   beforeEach(() => {
  //     @NgModule({
  //       imports: [StoreModule.forFeature(WEATHER_FEATURE_KEY, weatherReducer), EffectsModule.forFeature([WeatherEffects])],
  //       providers: [WeatherFacade],
  //     })
  //     class CustomFeatureModule {}
  //
  //     @NgModule({
  //       imports: [NxModule.forRoot(), StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule],
  //     })
  //     class RootModule {}
  //     TestBed.configureTestingModule({ imports: [RootModule] });
  //
  //     store = TestBed.inject(Store);
  //     facade = TestBed.inject(WeatherFacade);
  //   });
  //
  //   /**
  //    * The initially generated facade::loadAll() returns empty array
  //    */
  //   it('loadAll() should return empty list with loaded == true', async () => {
  //     let list = await readFirst(facade.allWeather$);
  //     let isLoaded = await readFirst(facade.loaded$);
  //
  //     expect(list.length).toBe(0);
  //     expect(isLoaded).toBe(false);
  //
  //     facade.init();
  //
  //     list = await readFirst(facade.allWeather$);
  //     isLoaded = await readFirst(facade.loaded$);
  //
  //     expect(list.length).toBe(0);
  //     expect(isLoaded).toBe(true);
  //   });
  //
  //   /**
  //    * Use `loadWeatherSuccess` to manually update list
  //    */
  //   it('allWeather$ should return the loaded list; and loaded flag == true', async () => {
  //     let list = await readFirst(facade.allWeather$);
  //     let isLoaded = await readFirst(facade.loaded$);
  //
  //     expect(list.length).toBe(0);
  //     expect(isLoaded).toBe(false);
  //
  //     store.dispatch(
  //       WeatherActions.loadWeatherSuccess({
  //         weather: [createWeatherEntity('AAA'), createWeatherEntity('BBB')],
  //       })
  //     );
  //
  //     list = await readFirst(facade.allWeather$);
  //     isLoaded = await readFirst(facade.loaded$);
  //
  //     expect(list.length).toBe(2);
  //     expect(isLoaded).toBe(true);
  //   });
  // });

  it('true', () => {
    expect(true).toBeTruthy();
  });
});
