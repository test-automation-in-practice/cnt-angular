import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { toPromise } from '../../../testing-helpers/observables';
import { ApiModelGenerators } from '../../../testing-helpers/api-model-generators';

describe('WeatherService', () => {
  let service: WeatherService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  describe('A user requesting the weather for a location', () => {
    it('should update the state with the weather for the location', async () => {
      const location = 'stuttgart';
      const temp = 25;

      const requestPromise = toPromise(service.getWeatherForLocation(location));
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
      request.flush(ApiModelGenerators.createWeatherApiModel(location, temp));

      const weather = await requestPromise;
      expect(weather[0]).toEqual(expect.objectContaining({ temp, location }));
    });
  });

  describe('A user requesting their main location', () => {
    it('should update the state with the main location', async () => {
      const location = 'stuttgart';

      const requestPromise = toPromise(service.getMainLocation());
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const locationState = await requestPromise;
      expect(location).toEqual(locationState);
    });
  });

  describe('A user saving their main location', () => {
    it('should update the state with the saved location', async () => {
      const location = 'stuttgart';

      const requestPromise = toPromise(service.saveMainLocation(location));
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const locationState = await requestPromise;
      expect(location).toEqual(locationState);
    });
  });
});
