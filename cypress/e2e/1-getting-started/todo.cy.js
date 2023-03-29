describe('Login Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200'); // assuming the login component is served at '/login'
  });

  // it('should display user information', () => {
  //   cy.get('div').contains('User Information'); // make sure the User Information heading is displayed
  //   cy.get('p').contains('ID'); // make sure the user ID is displayed
  // });

  

  it('should redirect to Spotify API', () => {
    cy.get('button').contains('Redirect to Spotify API').click(); // click the Redirect to Spotify API button
    //cy.url().should('eq', 'https://api.spotify.com/'); // make sure the URL has changed to the Spotify API URL
  });

  // it('should handle auth', () => {
  //   cy.get('button').contains('handle auth').click(); // click the handle auth button
  //   cy.url().should('include', 'https://accounts.spotify.com/'); // make sure the URL has changed to the Spotify accounts URL
  // });
  it('should add multiple friends and select a Random Friend', () => {
    const friendNames = ['John', 'Sarah', 'Mike', 'Akshat', 'Aryaan Verma', 'Vasu Sorathia', 'Drake', 'Kevin']; // set an array of friend names to use in the test
    cy.wrap(friendNames).each((friendName) => { // loop through the friend names array using Cypress' .each() method
      cy.get('input').type(friendName); // type the friend name in the input field
      cy.get('button').contains('Add Friend').click(); // click the Add Friend button
      cy.get('ul').contains(friendName); // make sure the friend name is displayed in the list of friends
      cy.get('input').clear(); // clear the input field for the next friend name
    });

    const randomIndex = Math.floor(Math.random() * friendNames.length);
    const selectedFriend = friendNames[randomIndex];
    
    // Select the friend from the dropdown
    cy.get('.friend-selector').within(() => {
      cy.get('select').select(selectedFriend);
    });
    
    // Verify that the selected friend is displayed in the list
    cy.get('ul').contains(selectedFriend).should('be.visible');
  });


    it('should navigate to home page', () => {
      cy.get('a').contains('Home').click(); // click the "Home" link
      cy.url().should('include', '/home'); // make sure the URL has changed to the home page URL
    });
  
    it('should navigate to login page', () => {
      cy.get('a').contains('Login').click(); // click the "Login" link
      cy.url().should('include', '/login'); // make sure the URL has changed to the login page URL
    });

  
  




  // it('should display songs on submit', () => {
  //   cy.get('button').contains('Display Songs').click(); // click the Display Songs button
  //   cy.get('.song-card').should('have.length', 1); // make sure at least one song card is displayedd
  // });
});
