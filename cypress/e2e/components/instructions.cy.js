// Define a Cypress test suite for the landing page
describe("Landing Page", () => {
  beforeEach(() => {
    // Navigate to the landing page before each test
    cy.visit("http://localhost:4200/landing");
  });

  // Define a test to check the title of the page
  it("displays the correct title", () => {
    cy.get(".vibey-header").should("contain", "Join the House of Vibez Today");
  });

  // Define a test to check the quote displayed on the page
  it("displays the correct quote", () => {
    cy.get("#quote-text").should(
      "contain",
      '"Good VIBEz Only" - People of Planet Earth 🌎'
    );
  });

  // Define a test to check the instructions displayed on the page
  it("displays the correct instructions", () => {
    cy.get(".instructions").should(
      "contain",
      'Press "Link Spotify" and signin with your Spotify account'
    );
    cy.get(".instructions").should(
      "contain",
      'Press "Login" & now you are registered'
    );
    cy.get(".instructions").should(
      "contain",
      'Enter your friends\' Spotify usernames who are also registered and click "Add Friends"'
    );
    cy.get(".instructions").should(
      "contain",
      'Click "Create a Group" & follow group setup prompts'
    );
    cy.get(".instructions").should(
      "contain",
      'Click "Display Songs" & start liking/disliking the songs to match your group\'s vibe'
    );
    cy.get(".instructions").should(
      "contain",
      "Enjoy and connect with friends through VibeShare!"
    );
  });

  // Define a test to check that clicking the "Get Vibing" button navigates to the correct route
  it('navigates to the correct route when "Get Vibing" button is clicked', () => {
    cy.get("button").contains("Get Vibing 😆").click();
    cy.url().should("include", "/main");
  });
});
