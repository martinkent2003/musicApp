# Sprint 4

### Date: 04-19-2023

## Work Update

- Updated the UI to improve the landing page aesthetic and functionality.
- Created a set of Instructions to demonstrate to the user how the app should function, which they can navigate to from the actual main part of the application if needed for reference.
- Used dataset of Famous people quotes that contain the word "vibe" for bigger effect and some added humor for the user to enjoy while using the application.
- In the Main page, added some styling to list your groups/parties and friends within them. 
- Users are now able to choose from the existing set of users to ensure that they are not able to choose random users/names that would not work in the database.
- Streamlined the process on the main page so it is ordered in chronological order for the user to know exactly what their next steps are in the process.
- The different functions used on the backend to update the user's groups and friends have been changed to append things to the user rather than completely re-write the values and additionally, checks for duplicates to ensure that there is no confusion on the application when trying to retreive information about a user
- Created checks for certain things like checking if a certain song has been matched or not to ensure that it does not show up again on another person's application when using the Tinder UI to put songs into the playlist.

## Unit Tests:
### Frontend:
- Component Test e2e:
  - about.cy.js: Tests URL, title, paragraphs, & correct members with images and titles
  - instructions.cy.js: Tests URL, title, instructions, quotes, & checks if button redirects properly
  - main.cy.js: Tests Link Spotify, Login, adding a friend, creating a group, choosing a group, like and dislike songs
- nav.cy.js: Tests if each button on the navigation bar works

### Backend:
- Changed all of the unit tests for the users and groups as the structure of data changed slightly
- Created Unit tests For Users:
- tested adding a user to the database
- getting a user from the database
- getting all of the users in a database
- updating a users data as a whole - deleting a user that was added to the database in that function
-testing to see if the update user friends and update user groups functions work to change the respective values. 

- Created Unit tests for Groups:
- Tested getting all of the groups in the groups databse
- tested adding a gop to the databse with the different important values
- tested getting a specific group using their groupID
- tested updating a group's data as a whole
- Tested updating a group's users specifically and updating the playlist name specifically as those are specific things that are needed to ensure that there are no duplicates
- Tested adding a liked song to the group liked song array 
- Tested to see if a song was matched or not in a specific group
- Tested deleting a group from the database

Documentation for backend:

Group Struct:
Model for a group object, which holds:
- a unique GroupID string for identification
- a slice of strings which holds userIDs for users in the group
- a playlistID string which stores the ID for the playlist made by the group
- a map named SemiMatched which contains stores song IDs for they key, and the ratio of
users in the group who like the song divided by the number of users in the group
- a slice of strings named Matched which contains stores song IDs for group
- when the ratio of likes/users in SemiMatched goes above a certain threshold, the song is
removed from SemiMatched and added to Matched, meaning a significant amount of users in the(not used in final version for testing)
group like the song.

User Struct:
structure for user containing friends, liked songs and user id
friends and likedsong should contain an array of strings and userID should be a string
Friends is a list of all of the friends of a user on the platform
LikedSong is a list of all of the songs that a user has liked on the platform using the Tinder UI (swiping right)
UserID is the unique identifier of a user that is generated from the Spotify ID

-------------------------------------------------------------------------------------------

GroupRepository Save:
The Save method in GroupRepostitory takes a group object input
and adds the group to the group collection in the firestore database

GroupRepository FindAll():
The FindAll method in GroupRepository takes no input and returns a string of group objects which are collected from the groups collection in firebase.This method uses the convertToStringSlice and convertToMap functions to convert the interface type used by firebase into slices and maps that match the type of the fields in the group model.

GroupRepository FindGroup():
The FindGroup method in GroupRepository takes in a groupID input and then searches the collection of groups in firestore to check for matching ID. Then it returns a group object with the contents of the correspoding document in firestore. However, since the groupID is already known as it is used to search, the returned object groupID is the document ID for the group in firebase.

GroupRepository DeleteGroup():
The DeleteGroup method in GroupRepository takes in a groupID input and then searches
the collection of groups in firestore to check for matching ID. Then it deletes the
corresponding document in firestore.

GroupRepository Update():
The Update method in GroupRepository takes in a group object input and then searches
the collection of groups in firestore to check for matching ID. Then it updates the
corresponding document in firestore with the fields in the input group object.
It also makes sure to only update the fields that are not empty.

GroupRepository convertToStringSlice():
convertToStringSlice converts an interface{} slice to a []string slice
It returns an error if the input is not a []interface{} or if any of the elements are not strings

GroupRepository convertToMap():
convertToMap converts an interface{} map to a map[string]bool map
It returns an error if the input is not a map[string]interface{} or if any of the values are not bools

-------------------------------------------------------------------------------------------

UserRepository Save():
The Save method opens up a Firestore client, creates a new user in the users collection and returns the user object after it has been saved to the database

UserRepository Update(): 
The Update method in UserRepository takes a user object input
and updates the user in the user collection in the firestore database

UserRepository FindUser():
The FindUser method opens up a Firestore client, gets the user with the given userID and returns the user object
It looks for the user with the given userID in the users collection by comparing all of the userID's to the given ID

UserRepository FindAll():
The FindAll method opens up a Firestore client, gets all of the users in the users collection and returns a slice of user objects which contain all of the users in the database. It uses a helper function convertToStringSlice to convert the Friends and LikedSong fields from interface{} to []string and convertToMap to convert the GroupAdmin field from interface{} to map[string]bool

UserRepository Delete():
The DeleteUser method takes a userID as input and deletes the user with the given userID from the users collection. It looks for the user with the given userID in the users collection by comparing all of the userID's to the given ID

UserRepository convertToStringSlice():
convertToStringSlice converts an interface{} slice to a []string slice
It returns an error if the input is not a []interface{} or if any of the elements are not strings

UserRepository convertToMap():
convertToMap converts an interface{} map to a map[string]bool map
It returns an error if the input is not a map[string]interface{} or if any of the values are not bools

-------------------------------------------------------------------------------------------

route getGroups():
The getGroups function in route.go takes a response writer and request,
and then calls the FindAll method in groupRepository\groupPost-repo.go
to get all the groups in the group collection in the firestore database

route getGroup():
The getGroup function in route.go takes a response writer and request,
and then calls the FindGroup method in groupRepository\groupPost-repo.go to get a specific group in the group collection in the firestore database

route getUser():
getUser function gets a specific user using the userID.
It uses the FindUser method in the UserRepository interface to fetch the user from the Firestore database. If there is an error, it returns a 500 status code and an error message.

route addGroups():
The addGroups function in route.go takes a response writer and request,
and then calls the Save method in groupRepository\groupPost-repo.go
to add a group to the group collection in the firestore database

route getUsers():
The getUsers function gets all the users from the userRepo and returns them as a JSON array.
It uses the FindAll method in the UserRepository interface to fetch the users from the Firestore database.
If there is an error, it returns a 500 status code and an error message.

route addUsers():
addUsers function adds a new user to the userRepo. It uses the Save method in the UserRepository interface to save the user to the Firestore database. If there is an error, it returns a 500 status code and an error message.

route putUsers():
putUsers function updates a pre-existing user to the userRepo.
It uses the Save method in the UserRepository interface to save the user to the Firestore database.
If there is an error, it returns a 500 status code and an error message.

route putGroup():
the PutGroup function updates a pre-existing group to the groupRepo.
It uses the Update method in the GroupRepository interface to save the group to the Firestore database.
If there is an error, it returns a 500 status code and an error message.

route updatePlaylistName():
updateGroupUsers updates the users in a group in the database by taking the new users as input from the request body,
finding the group with the provided groupID, and updating its users in the database. The function does not return anything,
it updates the group's users in the database and sends a response to the client in JSON format.

route updateGroupUsers():
updateGroupUsers updates the users in a group in the database by taking the new users as input from the request body,
finding the group with the provided groupID, and updating its users in the database. The function does not return anything,
it updates the group's users in the database and sends a response to the client in JSON format.

route removeDuplicates():
The helper function removes duplicate elements from a slice of strings.
The function takes in a slice of strings and returns a slice of strings with no duplicates.
It helps to remove duplicate users from a group as sometimes it can be
done unintentionally.

route deleteUser():
The function deletes a user with the given ID from the user Repository
The function takes in a response writer and a request as parameters.
The function does not return anything, it deletes the user from the database and
sends a response to the client in JSON format.

route updateUserGroups():
The function updates the groups of a user.
The function takes in a response writer and a request as parameters.
The function does not return anything, it updates the groups of the user in the database and
sends a response to the client in JSON format.
It does so by getting the user from the database, adding the new groups to the user and
keeping the rest of the values the same as what they were in the database.
Additionally, it removes any duplicates from the groups array to ensure
that there are not multiple instances of the same group for a user.

route updateUserFriends():
The function updates the friends of a user.
The function takes in a response writer and a request as parameters.
The function does not return anything, it updates the friends of the user in the database and
sends a response to the client in JSON format.
It does so by getting the user from the database, adding the new friends to the user and
keeping the rest of the values the same as what they were in the database because only the friends
are being updated for the user.
Additionally, it removes any duplicates from the friends array to ensure
that there are not multiple instances of the same friend for a user as that would
lead to confusion for when a person tries to choose a friend in the app.
Also, the function checks to see that the friends that are being added to the user
are actual members of the application to ensure that random users
and random names are not being put into the databse as they carry no information.





