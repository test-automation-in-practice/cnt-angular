import { LocationComponent } from './location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { WeatherModule } from '../../weather.module';

const getErrors = (errors: string) => {
  return [
    { errorStatus: 'required', errorMessage: 'Please enter a location before searching!' },
    { errorStatus: 'minlength', errorMessage: 'At least 3 characters are needed!' },
    { errorStatus: 'pattern', errorMessage: 'Numbers are not allowed!' },
  ].filter((error) => errors.includes(error.errorStatus))[0].errorMessage;
};

/**
 * Testing the input validation would be possible via snapshot testing.
 * But that would lead to large snapshots which are hard to maintain.
 * This is why we are going to use component harnesses to test the functionality
 * and some smaller snapshots for the general layout.
 */
describe('Location: A user', () => {
  describe('searching for a location', () => {
    let fixture: ComponentFixture<LocationComponent>;
    let component: LocationComponent;
    let loader: HarnessLoader;

    beforeEach(
      async () =>
        await TestBed.configureTestingModule({
          imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NoopAnimationsModule],
          declarations: [LocationComponent],
        }).compileComponents()
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(LocationComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('which is not valid', () => {
      test.each([
        [getErrors('required'), ''],
        [getErrors('minlength'), '1'],
        [getErrors('pattern'), '1'],
        [getErrors('minlength'), 'St'],
        [getErrors('pattern'), '123'],
      ])("should see '%s' error if they enters '%s'", async (error: string, inputValue: string) => {
        const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Enter location' }));
        await input.setValue(inputValue);
        const button = await loader.getHarness(MatButtonHarness);
        await button.click();
        const formField = await loader.getHarness(MatFormFieldHarness);
        const shownError = await formField.getTextErrors();
        expect(shownError).toContain(error);
      });

      it('should not be able to search', async () => {
        const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Enter location' }));
        await input.setValue('');
        jest.spyOn(component.searched, 'emit');
        const button = await loader.getHarness(MatButtonHarness);
        await button.click();
        expect(component.searched.emit).not.toHaveBeenCalled();
      });
    });

    describe('which is valid', () => {
      it('should be able to search', async () => {
        const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Enter location' }));
        await input.setValue('Stuttgart');
        jest.spyOn(component.searched, 'emit');
        const button = await loader.getHarness(MatButtonHarness);
        await button.click();
        expect(component.searched.emit).toHaveBeenCalled();
      });
    });
  });

  describe('viewing the component', () => {
    beforeEach(() => MockBuilder(LocationComponent, WeatherModule));

    it('should see a consistent layout with their saved location', () => {
      const fixture = MockRender(LocationComponent, { defaultLocation: 'Stuttgart' });
      expect(fixture).toMatchSnapshot();
    });

    it('should see a consistent layout if no location is saved', () => {
      const fixture = MockRender(LocationComponent, { defaultLocation: undefined });
      expect(fixture).toMatchSnapshot();
    });
  });
});
