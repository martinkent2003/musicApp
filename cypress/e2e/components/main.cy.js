
describe('Login Component', () => {
  it('should test all of main fucntionality', () => {

    cy.visit('http://localhost:4200/main')
    
    cy.get('button').contains('Link Spotify').click(); // click the Redirect to Spotify API button


  
    const checkUrl = (counter) => {

      if (counter > 60) {
        throw new Error('Timed out waiting for redirect to localhost');
      }

      cy.url().then(url => {
        if (!url.includes('http://localhost:4200/')) {
  
          cy.wait(1000); // wait 1 second before checking the URL again
          checkUrl(counter + 1); // call the function recursively with an incremented counter
        } else {
          cy.url().should('include', 'http://localhost:4200/'); // make sure the URL has changed to the localhost URL
        }
      });
      
    };
  
    checkUrl(0); // start the recursive function with a counter of 0

    cy.get('button').contains('Login').click();
    cy.wait(2000); // wait for 2 seconds to allow the select element to load
  
    cy.get('#nameSelect').select('shafdor');
    cy.get('button').contains('Add Friend').click();

    cy.get('.friend-view').should('be.visible'); // check that the friend view element is visible
    cy.get('.friend-item').should('exist'); // check that there is at least one friend item element
    cy.get('button').contains('Create a Group').click(); // find the button element by its text and click it
    cy.get('.group-form').should('be.visible'); // check that the group-form element is visible

    const groupName = 'My New Group'; // replace with the desired group name
    cy.get('#typeGroup').type(groupName); // find the input element and type in the group name
    cy.get('#typeGroup').should('have.value', groupName); // check that the input value matches the typed text

    const playlistName = 'My New Playlist'; // replace with the desired playlist name
    cy.get('#typePlaylist').type(playlistName); // find the input element and type in the playlist name
    cy.get('#typePlaylist').should('have.value', playlistName); // check that the input value matches the typed text


    const friendName = 'shafdor'; // replace with the desired friend name
    cy.get('#selectFriend').select(friendName); // find the select element by ID and select the desired friend
    cy.get('#addFriendButton').click(); // find the button element by ID and click it

    cy.get('#dropDown').select('4173');

    // assert that the selected value matches what was chosen
    cy.get('#dropDown')
      .should('have.value', '4173');

    cy.get('#selectingFriend').select('shafdor')
    cy.get('#selectingFriend').should('have.value', 'shafdor')

    cy.get('#selectingFriendP').select('idk')
    cy.get('#selectingFriendP').should('have.value', 'idk')

    cy.get('#blendButton').click();

    cy.get('#selectAGroup').select('4174 - 4174play')

    cy.get('.song-card button')
    .contains('Like')
    .click();


    cy.get('.song-card button')
    .contains('Dislike')
    .click();
 
  });
  

});