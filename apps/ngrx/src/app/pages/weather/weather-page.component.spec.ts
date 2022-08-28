import '../../testing-helpers/window.mock';
import { MockBuilder, MockRender, MockService, ngMocks } from 'ng-mocks';
import { WeatherPageComponent } from './weather-page.component';
import { WeatherPageModule } from './weather-page.module';
import { WeatherService } from './+state/service/weather.service';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { environment } from '../../../environments/environment';
import { MatCardHarness } from '@angular/material/card/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { WeatherIntroductionComponent } from './paragraphs/introduction/weather-introduction.component';
import { WeatherExplanationComponent } from './paragraphs/explanation/weather-explanation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WeatherLocation, WeatherModule } from '@cntws/weather';
import { ErrorMessageComponent, LoadingComponent } from '@cntws/shared';
import { StoreModule } from '@ngrx/store';
import * as fromWeather from './+state/weather.reducer';
import { EffectsModule } from '@ngrx/effects';
import { WeatherEffects } from './+state/weather.effects';
import { WeatherFacade } from './+state/weather.facade';
import { ApiModelGenerators } from '@cntws/testing';

type serviceMockProps = {
  isLoading?: boolean;
  warning?: string | undefined;
  weather?: WeatherLocation[];
  mainLocation?: string | undefined;
};

function createWeatherFacade(opts: serviceMockProps) {
  const stateOverrides = {
    loaded$: of(!opts.isLoading),
    error$: of(opts.warning),
    weather$: of(opts.weather ? opts.weather : []),
    mainLocation$: of(opts.mainLocation),
  };
  return MockService(WeatherFacade, stateOverrides);
}

const MaterialModules = [MatCardModule, MatExpansionModule, MatInputModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule];

describe('Weather Page: A user visiting the page', () => {
  /**
   * These tests are testing the complete module and give us confidence for bigger refactorings.
   * They are rather brittle and thus, we have to use them carefully.
   * Further, they do not give good insights in why a specific scenario is failing.
   * This leads to a need of additional tests for your components to get better feedback.
   */
  describe('and having their data loaded', () => {
    let fixture: ComponentFixture<WeatherPageComponent>;
    let loader: HarnessLoader;
    let controller: HttpTestingController;

    beforeEach(async () => {
      return TestBed.configureTestingModule({
        declarations: [WeatherPageComponent, WeatherIntroductionComponent, WeatherExplanationComponent],
        imports: [
          NoopAnimationsModule,
          WeatherModule,
          HttpClientTestingModule,
          ReactiveFormsModule,
          ErrorMessageComponent,
          LoadingComponent,
          ...MaterialModules,
          StoreModule.forRoot({ [fromWeather.WEATHER_FEATURE_KEY]: fromWeather.weatherReducer }),
          EffectsModule.forRoot([WeatherEffects]),
        ],
        providers: [WeatherService, WeatherFacade],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(WeatherPageComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      controller = TestBed.inject(HttpTestingController);
    });

    it('should load their saved location', async () => {
      const location = 'stuttgart';
      const temp = 25;

      const locationRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      locationRequest.flush(ApiModelGenerators.createLocationApiModel(location));
      const weatherRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
      weatherRequest.flush(ApiModelGenerators.createWeatherApiModel(location, temp));

      await loader.getHarness(MatCardHarness.with({ subtitle: new RegExp(`.*(${location}).*`) }));
    });

    it('should load the weather for their saved location', async () => {
      const location = 'stuttgart';
      const temp = 25;

      const locationRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      locationRequest.flush(ApiModelGenerators.createLocationApiModel(location));
      const weatherRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
      weatherRequest.flush(ApiModelGenerators.createWeatherApiModel(location, temp));

      await loader.getHarness(MatCardHarness.with({ title: location }));
    });

    it('should be able to search for a location', async () => {
      const location = 'stuttgart';
      const temp = 25;

      const locationRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      locationRequest.flush(ApiModelGenerators.createLocationApiModel(location));
      const weatherRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
      weatherRequest.flush(ApiModelGenerators.createWeatherApiModel(location, temp));

      const locationCard = await loader.getHarness(MatCardHarness.with({ subtitle: new RegExp(`.*(location).*`) }));
      const locationInput = await locationCard.getHarness(MatInputHarness);
      const searchedWeather = 'Frankfurt';
      await locationInput.setValue(searchedWeather);
      const searchButton = await locationCard.getHarness(MatButtonHarness);
      await searchButton.click();
      const searchedWeatherRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${searchedWeather}`);
      searchedWeatherRequest.flush(ApiModelGenerators.createWeatherApiModel(searchedWeather, temp));

      await loader.getHarness(MatCardHarness.with({ title: searchedWeather }));
    });
  });

  describe('should have a consistent layout', () => {
    beforeEach(() => {
      ngMocks.reset();
      return MockBuilder(WeatherPageComponent, WeatherPageModule);
    });

    it('if the service is loading', () => {
      const facade = createWeatherFacade({ isLoading: true });
      const fixture = MockRender(WeatherPageComponent, {}, { providers: [{ provide: WeatherFacade, useValue: facade }] });
      expect(fixture.point.nativeElement).toMatchSnapshot();
    });

    it('if the service has a warning', () => {
      const facade = createWeatherFacade({ warning: 'This is a warning!' });
      const fixture = MockRender(WeatherPageComponent, {}, { providers: [{ provide: WeatherFacade, useValue: facade }], reset: true });
      expect(fixture.point.nativeElement).toMatchSnapshot();
    });

    it('if the service has no warning and results', () => {
      const facade = createWeatherFacade({
        weather: [
          { id: 1, location: 'Stuttgart', temp: 23 },
          { id: 2, location: 'Frankfurt', temp: 15 },
        ],
      });
      const fixture = MockRender(WeatherPageComponent, {}, { providers: [{ provide: WeatherFacade, useValue: facade }] });
      expect(fixture.point.nativeElement).toMatchSnapshot();
    });
  });
});
