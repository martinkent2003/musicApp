# Sprint 2

### Date: 2023-03-29

## Frontend work update:

- Updated the UI with animations for "Link Spotify" and "Login" buttons, a banner with our name, and a color scheme with Spotify green and blue.
- Added normalize.css for cross-platform compatibility.
- Updated spotifyservices.ts with comments and reordered functions, and fixed bugs with the login function.
- Added environment.ts to hold client ID and client secret from Spotify for future routing solutions.
- Added TODOs for easier tracking using vscode extensions.
- Created a dualwindow branch to separate the current login.component.ts into two components for better code organization
- Animated the login button like an equalizer to keep the user entertained while waiting for the login to complete.
- Updated the angular routing to add a home component

## Frontend work to do:
- Finish separating login.component.ts into two components.
- Fix bugs with some buttons and continue styling 

## Backend work update:
- Implemented delete method for users and groups which uses the ID to search for and delete certain documents from the database
- Fixed duplicate users bug by checking for pre-existing user in database before allowing for the creation of new one
- Implemented the put request for Users which allows frontend to change specific fields from a given user without modifying anything else
## Backend work to do:
- Compute how songs in the group category will be updated based on the user's preferences, and by what metric it will changed from semi-matched to matched
- 

## Unit Test:
### Frontend:
- 
### Backend:
- Same Unit test as previous sprint
- Addition of unit tests for new DeleteUser and DeleteGroup which makes sure that the total number of users is one less than what it was after deleteing 
- Addition of unit test for PutUser, which makes sure that the fields of a user are properly updated after a put request updating a user
