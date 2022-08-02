import { MockBuilder, MockRender } from 'ng-mocks';
import { WeatherResultsComponent } from './weather-results.component';
import { By } from '@angular/platform-browser';
import {WeatherModule} from "../../weather.module";
import {WeatherLocation} from "../../model/weather.model";

describe('Weather Results: A user', () => {
  describe('viewing their results', () => {
    beforeEach(() => MockBuilder(WeatherResultsComponent, WeatherModule));

    it('should see a consistent layout', () => {
      const weatherLocations: WeatherLocation[] = [
        { id: 1, temp: 25, location: 'Stuttgart' },
        { id: 2, temp: 22, location: 'Freiburg' },
      ];
      const fixture = MockRender(WeatherResultsComponent, { weatherLocations });
      expect(fixture).toMatchSnapshot();
    });

    it('should be able to save their location', () => {
      const stuttgartLocation = { id: 1, temp: 25, location: 'Stuttgart' };
      const weatherLocations: WeatherLocation[] = [stuttgartLocation, { id: 2, temp: 22, location: 'Freiburg' }];
      const fixture = MockRender(WeatherResultsComponent, { weatherLocations });
      jest.spyOn(fixture.point.componentInstance.savedLocation, 'emit');
      const card = fixture.debugElement.query(By.css(`#location-${stuttgartLocation.location}`));
      const button = card.query(By.css('button')).nativeElement;
      button.click();
      expect(fixture.point.componentInstance.savedLocation.emit).toHaveBeenCalledWith(stuttgartLocation);
    });
  });
});
