// Define a Cypress test suite for the About Us page
describe("About Us Page", () => {
  beforeEach(() => {
    // Navigate to the About Us page before each test
    cy.visit("http://localhost:4200/about");
  });

  // Define a test to check the title of the page
  it("displays the correct title", () => {
    cy.get("h1").should("contain", "About Us");
  });

  // Define a test to check the first and second paragraphs on the page
  it("displays the correct paragraphs", () => {
    cy.get("#first-paragraph").should(
      "contain",
      "We are a team of music enthusiasts who believe that music is the ultimate medium for connection and expression."
    );
    cy.get("#second-paragraph").should(
      "contain",
      "Our mission is to create a platform that allows music lovers to connect, share, and discover new music together. We believe that music has the power to bring people together and create positive change in the world."
    );
  });

  // Define a test to check the team members displayed on the page
  it("displays the correct team members", () => {
    // Define an array of team member objects with names, roles, and image URLs
    const expectedTeamMembers = [
      {
        name: "Michael Shaffer",
        role: "Frontend Engineer",
        image: "https://i.imgur.com/ilNhW13.png",
      },
      {
        name: "Akshat Pant",
        role: "Frontend Engineer",
        image: "https://i.imgur.com/7g6YRaT.png",
      },
      {
        name: "Martin Kent",
        role: "Backend Engineer",
        image: "https://i.imgur.com/S4PAtPy.png",
      },
      {
        name: "Aryaan Verma",
        role: "Backend Engineer",
        image: "https://i.imgur.com/bdxEgO2.png",
      },
    ];

    // Check that the correct number of team member cards are displayed
    cy.get(".team-members .member").should(
      "have.length",
      expectedTeamMembers.length
    );

    // Loop through each expected team member object and check that their information is displayed correctly
    expectedTeamMembers.forEach((member, index) => {
      cy.get(".team-members .member")
        .eq(index)
        .within(() => {
          cy.get("h3").should("contain", member.name);
          cy.get("p").should("contain", member.role);
          cy.get("img").should("have.attr", "alt", member.name);
          cy.get("img").should("have.attr", "src", member.image);
        });
    });
  });
});
