// Define a test suite for the Navbar
describe("Navbar", () => {
  // Set up the initial test conditions before each test
  beforeEach(() => {
    cy.visit("http://localhost:4200/landing");
  });

  // Define a test that verifies clicking on "Instructions" navigates to the landing page
  it('clicking on "Instructions" navigates to the landing page', () => {
    cy.get("nav a").contains("Instructions").click();
    cy.url().should("include", "/landing");
  });

  // Define a test that verifies clicking on "Main" navigates to the main page
  it('clicking on "Main" navigates to the main page', () => {
    cy.get("nav a").contains("Main").click();
    cy.url().should("include", "/main");
  });

  // Define a test that verifies clicking on "About Us" navigates to the about page
  it('clicking on "About Us" navigates to the about page', () => {
    cy.get("nav a").contains("About Us").click();
    cy.url().should("include", "/about");
  });
});
