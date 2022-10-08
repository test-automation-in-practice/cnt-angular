const searchLocation = (location: string) => {
  cy.get('input[placeholder="Enter location"]').type(location);
  cy.get('button').contains('Search').click();
};

export const WeatherApp = {
  searchLocation,
};
