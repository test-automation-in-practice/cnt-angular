import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ApiModelGenerators, toPromise } from '@cntws/testing';

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

      service.getWeatherForLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${location}`);
      request.flush(ApiModelGenerators.createWeatherApiModel(location, temp));

      const weather = await toPromise(service.weather$);
      expect(weather[0]).toEqual(expect.objectContaining({ temp, location }));
    });

    it('should activate the loading state when requesting', async () => {
      const region = 'stuttgart';

      service.getWeatherForLocation(region);

      const isLoading = await toPromise(service.isLoading$);
      expect(isLoading).toBeTruthy();
      controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
    });

    it('should deactivate the loading state after the request completed successfully', async () => {
      const region = 'stuttgart';
      const temp = 25;

      service.getWeatherForLocation(region);
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
      request.flush(ApiModelGenerators.createWeatherApiModel(region, temp));

      const isLoading = await toPromise(service.isLoading$);
      expect(isLoading).toBeFalsy();
    });

    it('should deactivate the loading state after the request completed with an error', async () => {
      const region = 'stuttgart';

      service.getWeatherForLocation(region);
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
      request.flush({ message: 'stuttgart was not found' }, { status: 404, statusText: 'not found' });

      const isLoading = await toPromise(service.isLoading$);
      expect(isLoading).toBeFalsy();
    });

    it('should get a warning after the request completed with an error', async () => {
      const region = 'stuttgart';

      service.getWeatherForLocation(region);
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
      const message = 'stuttgart was not found';
      request.flush({ message }, { status: 404, statusText: 'not found' });

      const warning = await toPromise(service.warning$);
      expect(warning).toEqual(message);
    });

    it('should reset the warning after the request completed successfully', async () => {
      const region = 'stuttgart';
      const temp = 25;

      service.getWeatherForLocation(region);
      const errorRequest = controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
      errorRequest.flush({ message: 'stuttgart was not found' }, { status: 404, statusText: 'not found' });
      service.getWeatherForLocation(region);
      const request = controller.expectOne(`${environment.weatherApi}/locations?q=${region}`);
      request.flush(ApiModelGenerators.createWeatherApiModel(region, temp));

      const hasWarning = await toPromise(service.warning$);
      expect(hasWarning).toBeFalsy();
    });
  });

  describe('A user requesting their main location', () => {
    it('should update the state with the main location', async () => {
      const location = 'stuttgart';

      service.getMainLocation();
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const locationState = await toPromise(service.mainLocation$);
      expect(location).toEqual(locationState);
    });

    it('should activate the loading state when requesting', async () => {
      service.getMainLocation();

      const isLoading = await toPromise(service.isLoading$);
      expect(isLoading).toBeTruthy();
      controller.expectOne(`${environment.weatherApi}/mainLocation`);
    });

    it('should deactivate the loading state after the request completed successfully', async () => {
      const location = 'stuttgart';

      service.getMainLocation();
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const weather = await toPromise(service.isLoading$);
      expect(weather).toBeFalsy();
    });

    it('should deactivate the loading state after the request completed with an error', async () => {
      service.getMainLocation();
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      const weather = await toPromise(service.isLoading$);
      expect(weather).toBeFalsy();
    });

    it('should get a warning after the request completed with an error', async () => {
      service.getMainLocation();
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      const message = 'Internal Server Error';
      request.flush({ message }, { status: 500, statusText: message });

      const warning = await toPromise(service.warning$);
      expect(warning).toEqual(message);
    });

    it('should reset the warning after the request completed successfully', async () => {
      const location = 'stuttgart';

      service.getMainLocation();
      const errorRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      const message = 'Internal Server Error';
      errorRequest.flush({ message }, { status: 500, statusText: message });
      service.getMainLocation();
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const warning = await toPromise(service.warning$);
      expect(warning).toBeFalsy();
    });
  });

  describe('A user saving their main location', () => {
    it('should update the state with the saved location', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const locationState = await toPromise(service.mainLocation$);
      expect(location).toEqual(locationState);
    });

    it('should activate the loading state when requesting', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);

      const isLoading = await toPromise(service.isLoading$);
      expect(isLoading).toBeTruthy();
      controller.expectOne(`${environment.weatherApi}/mainLocation`);
    });

    it('should deactivate the loading state after the request completed successfully', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const weather = await toPromise(service.isLoading$);
      expect(weather).toBeFalsy();
    });

    it('should deactivate the loading state after the request completed with an error', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      const weather = await toPromise(service.isLoading$);
      expect(weather).toBeFalsy();
    });

    it('should get a warning after the request completed with an error', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      const message = 'Internal Server Error';
      request.flush({ message }, { status: 500, statusText: message });

      const warning = await toPromise(service.warning$);
      expect(warning).toEqual(message);
    });

    it('should reset the warning after the request completed successfully', async () => {
      const location = 'stuttgart';

      service.saveMainLocation(location);
      const errorRequest = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      const message = 'Internal Server Error';
      errorRequest.flush({ message }, { status: 500, statusText: message });
      service.saveMainLocation(location);
      const request = controller.expectOne(`${environment.weatherApi}/mainLocation`);
      request.flush(ApiModelGenerators.createLocationApiModel(location));

      const warning = await toPromise(service.warning$);
      expect(warning).toBeFalsy();
    });
  });
});
