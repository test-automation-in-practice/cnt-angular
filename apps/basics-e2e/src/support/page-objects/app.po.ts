const navigateTo = (navbutton: string) => {
  cy.visit('http://localhost:4201/');

  cy.get('a').contains(navbutton).click();
};

export const App = {
  navigateTo,
};
