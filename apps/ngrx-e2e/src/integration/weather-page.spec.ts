import { App } from '../support/page-objects/app.po';
import { WeatherApp } from '../support/page-objects/weather.po';
import { Setup } from '../support/helpers/setup';

describe('Weather page', () => {
  before(() => {
    App.navigateTo('Weather');
    Setup.database.resetMainLocation();
    Setup.database.resetLocations();
    cy.get('cntws-location').should('exist');
  });

  it('should return the results for a search for stuttgart', () => {
    WeatherApp.searchLocation('Stuttgart');
    cy.get('[id^=location]').should('have.length', 3);
  });

  it('should display the error for a non existent city', () => {
    const location = 'ThisCityDoesNotExist';
    WeatherApp.searchLocation(location);
    cy.get('cntws-error-message').should('contain.text', `${location}`);
  });

  afterEach(() => {
    Setup.database.resetMainLocation();
    Setup.database.resetLocations();
  });
});
