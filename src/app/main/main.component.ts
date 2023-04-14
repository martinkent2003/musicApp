// main.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { SpotifyService } from 'src/spotifyservice';
import { from } from 'rxjs';
import { all } from 'axios';
import { group } from '@angular/animations';
interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface Group {
  groupID: string;
  users: string[];
  playlistID: string;
  matched: string[];
}

interface FriendResponse {
  friends: string[]; // or any other type that matches the expected type of the friends array
  // any other properties you expect to receive in the response
}

interface User {
  Friends: string[];
  LikedSong: string[];
  UserID: string;
  groupAdmin: Record<string, boolean>;
  Groups: Group[];
}

interface Song {
  id: string;
  name: string;
  imageUrl: string;
  audioUrl: string;
}

const url = 'http://localhost:8000/groupPost';

const groupData = {
  groupID: 'exampleGroup',
  users: ['user1', 'user2', 'user3'],
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  email: string = '';
  password: string = '';
  userData: any;
  selectedPlaylistId: string = '';
  blendPID: string = '';
  Fplaylists: Array<Playlist> = [];
  playlists: Array<Playlist> = [];
  songs: Array<Song> = [];
  userIds: string[] = [];
  user: string = '';
  dropDown: string = '';
  friendsUserId: string[] = [];
  selectedFriend: string = '';
  sFriends: string = '';
  selectedFriendsForGroup: string[] = [];
  groupOfFriends: string[] = [];
  selectedPlaylistF = '';
  semiMatchedSongs: Array<Song> = []; // make a get request to pull all of the semi matched songs to display to the user
  matchedOwner: Array<Song> = []; // makes get request and allow user to add matched songs to the playlist
  randomP: Playlist[] = [];
  randomActualSongs: Playlist | undefined;
  myNumber: number = 0;
  playlistS: string = ''; // universal friend playlist that was selected
  myPlaylist: Playlist | undefined;
  arbAddSongs: Array<Song> = [];
  createdPlaylistID: string | undefined;
  playlistName: string = '';
  allOfMyGroups: Group[] = [];
  allOfMyGroupNames: string[] = [];
  showGroupList: boolean = false;
  songIDs: string[] = [];
  selectedGroupPlaylist: Playlist | undefined;

  //nameInput: any;

  selectedGroupID!: string;
  selectedGroup: Group | undefined;
  selectedPlaylistID: string | undefined;

  async onSelect(groupID: string): Promise<void> {
    console.log(groupID);
    this.selectedGroup = this.allOfMyGroups.find(
      (group) => group.groupID === groupID
    );
    if (this.selectedGroup) {
      this.selectedGroupID = this.selectedGroup?.groupID;
    }

    this.selectedPlaylistID = this.selectedGroup?.playlistID;
    console.log(groupID);

    this.spotifyService.getPlaylists(this.user).subscribe((playlists) => {
      this.playlists = playlists;
      this.selectedGroupPlaylist = this.playlists.find(
        (playlist) => playlist.name === this.selectedPlaylistID
      );
    });

    // Use the non-null assertion operator to ensure that `this.playlists` is not undefined
    this.selectedGroupPlaylist = this.playlists!.find(
      (playlist) => playlist.name === this.selectedPlaylistID
    );

    this.spotifyService
      .getRandomSongsFromRapCategory()
      .subscribe((playlists) => {
        // PRETTY CONFIDENT ABT THIS BUT NOT ANYTHING ELSE
        this.randomP = playlists;

        const firstPlaylist = this.randomP[0];

        console.log(firstPlaylist); //does not work during first try - works second try
        console.log(firstPlaylist.songs);

        const playlistContainer = document.querySelector('.song-card');
        this.randomActualSongs = this.randomP[0]; // something wrong here

        console.log(this.randomActualSongs.songs); //does not work at all

        //ERROR HERE:  this.randomP does not update immdietly for use afterwards. this.randomActual songs also does not update immdietly for use afterwards. please fix this code

        if (!playlistContainer) {
          console.error('No .playlist-container element was found in the DOM.');
          return;
        }

        if (this.randomActualSongs?.songs) {
          const song = this.randomActualSongs.songs[this.myNumber];
          if (song) {
            const songContainer = document.createElement('div');
            songContainer.classList.add('song-container');

            const songImage = document.createElement('img');
            songImage.src = song.imageUrl;

            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = song.audioUrl;
            audioPlayer.style.position = 'absolute';
            audioPlayer.style.left = '820px';
            audioPlayer.style.top = '280px';

            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.position = 'relative';
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.flexDirection = 'column';
            buttonsContainer.classList.add('buttons-container');

            const likeButton = document.createElement('button');
            likeButton.innerText = 'Like';
            likeButton.style.position = 'absolute';
            likeButton.style.bottom = '0';
            likeButton.style.right = '0';

            likeButton.addEventListener('click', () => {
              this.addSong(song.id, this.selectedGroupID);

              this.arbAddSongs[0] = song;
              const songsA = {
                uris: this.arbAddSongs.map(
                  (song) => `spotify:track:${song.id}`
                ),
              };
              if (this.selectedGroupPlaylist) {
                this.spotifyService
                  .addSongs(this.user, this.selectedGroupPlaylist.id, songsA)
                  .subscribe((response) => {});
              }
              if (this.randomActualSongs?.songs) {
                // Increment myNumber to get the next song
                this.myNumber =
                  (this.myNumber + 1) % this.randomActualSongs?.songs.length;
                // Remove the current song container
                songContainer.remove();
                // Display the next song
                this.displaySong();
              }
            });

            const dislikeButton = document.createElement('button');
            dislikeButton.innerText = 'Dislike';
            dislikeButton.style.position = 'absolute';
            dislikeButton.style.bottom = '0';
            dislikeButton.style.left = '0';
            dislikeButton.addEventListener('click', () => {
              if (this.randomActualSongs?.songs) {
                // Increment myNumber to get the next song
                this.myNumber =
                  (this.myNumber + 1) % this.randomActualSongs.songs.length;
                // Remove the current song container
                songContainer.remove();
                // Display the next song
                this.displaySong();
              }
            });

            buttonsContainer.appendChild(likeButton);
            buttonsContainer.appendChild(dislikeButton);

            songContainer.appendChild(audioPlayer);
            songContainer.appendChild(songImage);
            //songContainer.appendChild(audioPlayer);
            songContainer.appendChild(buttonsContainer);

            playlistContainer.appendChild(songContainer);
          }
        } else {
          console.error('this.randomActualSongs.songs is undefined');
        }
      });
  }

  displaySong() {
    //displays a new song
    const playlistContainer = document.querySelector('.song-card');
    if (!playlistContainer) {
      console.error('Error: playlistContainer not found');
      return;
    }

    if (this.randomActualSongs?.songs) {
      const song = this.randomActualSongs.songs[this.myNumber];
      console.log('Displaying song:', song.name);

      const songContainer = document.createElement('div');
      songContainer.classList.add('song-container');

      const songImage = document.createElement('img');
      songImage.src = song.imageUrl;

      const audioPlayer = document.createElement('audio');
      audioPlayer.controls = true;
      audioPlayer.src = song.audioUrl;
      audioPlayer.style.position = 'absolute';
      audioPlayer.style.left = '820px';
      audioPlayer.style.top = '280px';

      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'relative'; // Position the button container relative to the song container
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'space-between'; // Position the buttons at the ends of the button container
      buttonContainer.style.width = '100%'; // Make the button container the same width as the song image

      const likeButton = document.createElement('button');
      likeButton.innerText = 'Like';
      likeButton.style.position = 'absolute'; // Position the like button absolute to the button container
      likeButton.style.bottom = '0'; // Position the like button at the bottom of the button container
      likeButton.style.right = '0'; // Position the like button at the right of the button container

      console.log('THIS SHOULD RUN', this.selectedGroupPlaylist);

      likeButton.addEventListener('click', () => {
        console.log('LIKE BUTTON CLICKED');
        this.addSong(song.id, this.selectedGroupID);

        this.arbAddSongs[0] = song;
        const songsA = {
          uris: this.arbAddSongs.map((song) => `spotify:track:${song.id}`),
        };
        console.log('THE SONGSSS', songsA);

        console.log(this.selectedGroupPlaylist);

        if (this.selectedGroupPlaylist) {
          this.spotifyService
            .addSongs(this.user, this.selectedGroupPlaylist.id, songsA)
            .subscribe((response) => {});
        }

        if (this.randomActualSongs) {
          // Increment myNumber to get the next song
          this.myNumber =
            (this.myNumber + 1) % this.randomActualSongs.songs.length;
          // Remove the current song container
          songContainer.remove();
          // Display the next song
          this.displaySong();
        }
      });

      const dislikeButton = document.createElement('button');
      dislikeButton.innerText = 'Dislike';
      dislikeButton.style.position = 'absolute'; // Position the dislike button absolute to the button container
      dislikeButton.style.bottom = '0'; // Position the dislike button at the bottom of the button container
      dislikeButton.style.left = '0'; // Position the dislike button at the left of the button container
      dislikeButton.addEventListener('click', () => {
        if (this.randomActualSongs) {
          // Increment myNumber to get the next song
          this.myNumber =
            (this.myNumber + 1) % this.randomActualSongs.songs.length;
          // Remove the current song container
          songContainer.remove();
          // Display the next song
          this.displaySong();
        }
      });

      buttonContainer.appendChild(likeButton);
      buttonContainer.appendChild(dislikeButton);

      songContainer.appendChild(audioPlayer);
      songContainer.appendChild(songImage);
      songContainer.appendChild(buttonContainer);

      playlistContainer.appendChild(songContainer);
    } else {
      console.error('Error: No songs found in this.randomActualSongs');
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {}

  // CHNAGE NEEDS TO HAPPEND FROM HERE AND BELOW <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  addFriend(name: string) {
    // change this to only push if the add FriendToDatatbase is successful
    if (name) {
      //this.friendsUserId.push(name); // switch this with the one below
      this.addFriendToDatabase(name);
    }
  }

  addSong(songID: string, groupName: string) {
    console.log('SONG ID', songID);
    const url = `http://localhost:8000/addSong/${groupName}`;
    const songData = JSON.stringify(songID);
    this.http.put(url, songData).subscribe((response) => {
      console.log(response);
    });
  }

  addFriendToDatabase(name: string) {
    console.log(this.friendsUserId);
    const url = 'http://localhost:8000/userUpdateFriends/';

    const friendData = {
      userID: this.user,
      friends: [name], // change to singular name intead of this.friendsUserId
    };

    this.http.put<FriendResponse>(url, friendData).subscribe((response) => {
      console.log(response);
      const friendsArray = response.friends; // extract the friends array from the response
      this.friendsUserId = friendsArray; // assign the extracted friends array to this.friendsUserId
    });
  }

  onPlaylistSelected(playlistS: string) {
    // when friend playlist is selected new playlist is created and friend playlist is saved
    this.playlistS = playlistS;
  }

  onFriendSelected(friend: string) {
    // selects a friend
    console.log('Friend selected:', friend);
    this.spotifyService.getPlaylists(friend).subscribe((playlists) => {
      this.Fplaylists = playlists;
      this.selectedFriend = friend;
    });
  }

  showGroupForm = false;
  groupName = '';
  //groupNameSubmitted = false;
  groupMembers: string[] = [];

  createNewGroup(): void {
    this.showGroupForm = true;
  }

  // add a button that allows admin to display liked songs from the group schema that aren't in the createdPlaylistID for the admin screen
  // this would be in the get groups by user id section of the screen - only the groups where the logged in user is the admin would have the above feature

  submitGroupName(): void {
    this.showGroupForm = true;
    const body = {
      groupID: this.groupName,
      //admin is the user who created the group -
      users: [this.user],
      playlist: this.createdPlaylistID, // name of the blended playlist from user input
      //have the defualt liked songs be the blended playlist
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    this.http
      .post<Group>('http://localhost:8000/groupPost', body, options)
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );

    const friendData = {
      userID: this.user,
      groups: [this.groupName], // change to singular name intead of this.friendsUserId
    };

    this.http
      .put<Group>(
        'http://localhost:8000/userUpdateGroups/',
        friendData,
        options
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }

  submitPlaylistName(): void {
    console.log(this.playlistName);
    const url = `http://localhost:8000/userUpdatePlaylists/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers };

    const GpData = {
      groupID: this.groupName,
      playlistID: this.playlistName, // change to singular name intead of this.friendsUserId
    };

    this.http.put<Group>(url, GpData, options).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  addFriendToGroup() {
    if (this.selectedFriend) {
      this.groupMembers.push(this.selectedFriend); // I think this is pointless
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    console.log(this.selectedFriend);
    const friendData = {
      groupID: this.groupName,
      users: [this.selectedFriend], // change to singular name intead of this.friendsUserId
    };

    const grpData = {
      userID: this.selectedFriend,
      groups: [this.groupName], // change to singular name intead of this.friendsUserId
    };

    this.http
      .put<Group>('http://localhost:8000/userUpdateGroups/', grpData, options) // adds groups to friends group list
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );

    this.http
      .put<Group>(
        'http://localhost:8000/groupUpdateUsers/',
        friendData,
        options
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }

  addFriendsToGroup(): void {
    // adds friends selected to group using a put request to database
    // const body = {
    //   groupID: this.,
    //   users: this.selectedFriendsForGroup
    // };
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const options = { headers: headers };
    // this.http.post<Group>('http://localhost:8000/groupPost', body, options)
    //   .subscribe(
    //       (res) => console.log(res),
    //       (err) => console.log(err)
    //   );
  }

  // CHNAGE NEEDS TO HAPPEND FROM HERE AND ABOVE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  async getUserData() {
    // ADD ALL OF THE SONGS ADDED TO PLAYLIST TO THE MATCHED SONGS ARRAY - done

    this.spotifyService
      .createPlaylist(this.playlistName, this.userIds, this.user)
      .then(() => {
        this.spotifyService.getPlaylists(this.user).subscribe((playlists) => {
          this.playlists = playlists;
          const selectedPlaylist = this.playlists.find(
            (playlist) => playlist.name === this.playlistName
          );
          this.createdPlaylistID = selectedPlaylist?.id;
          this.myPlaylist = selectedPlaylist;
          const blendP = this.Fplaylists.find(
            (playlist) => playlist.name === this.playlistS
          );
          if (blendP) {
            //console.log(blendP.name);
          }

          if (selectedPlaylist && blendP) {
            this.selectedPlaylistId = selectedPlaylist.id;
            this.spotifyService
              .getSongs(this.selectedFriend, blendP.id)
              .subscribe((allSongs) => {
                if (blendP && allSongs) {
                  // DOES NOT WORK HERE
                  const addedSongIds = new Set<string>();
                  const newSongIDs = allSongs
                    .filter((song) => !addedSongIds.has(song.name))
                    .map((song) => {
                      addedSongIds.add(song.name);
                      return song.id;
                    });
                  this.songIDs = [...new Set([...this.songIDs, ...newSongIDs])]; // combine existing and new song IDs and filter out duplicates
                  const songs = {
                    uris: newSongIDs.map((songId) => `spotify:track:${songId}`),
                  };

                  // PUT REQUEST HERE

                  this.spotifyService
                    .addSongs(
                      this.selectedFriend,
                      this.selectedPlaylistId,
                      songs
                    ) // ERROR HERE
                    .subscribe((response) => {});
                }
              });
          }
        });

        this.spotifyService.getPlaylists(this.user).subscribe((playlists) => {
          this.playlists = playlists;
          const selectedPlaylist = this.playlists.find(
            (playlist) => playlist.name === this.playlistName
          );
          this.myPlaylist = selectedPlaylist;
          const blendP = this.playlists.find(
            (playlist) => playlist.name === this.dropDown
          );
          if (selectedPlaylist && blendP) {
            this.selectedPlaylistId = selectedPlaylist.id;
            this.blendPID = blendP.id;
            this.spotifyService
              .getSongs(this.user, this.blendPID)
              .subscribe((allSongs) => {
                const playlist = this.playlists.find(
                  (p) => p.id === this.selectedPlaylistId
                );

                if (playlist && allSongs) {
                  const addedSongIds = new Set<string>();
                  const newSongIDs = allSongs
                    .filter((song) => {
                      if (!addedSongIds.has(song.id)) {
                        addedSongIds.add(song.id);
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((song) => song.id);
                  const songNames = allSongs
                    .filter((song) => !addedSongIds.has(song.id))
                    .map((song) => {
                      return song;
                    });

                  this.songIDs = [...new Set([...this.songIDs, ...newSongIDs])]; // combine existing and new song IDs and filter out duplicates
                  const songs = {
                    uris: newSongIDs.map((songId) => `spotify:track:${songId}`),
                  };

                  console.log('SONG NAMES', newSongIDs);

                  const url = `http://localhost:8000/groupPost/${this.groupName}`;
                  const headers = new HttpHeaders().set(
                    'Content-Type',
                    'application/json'
                  );
                  const options = { headers: headers };
                  console.log(this.songIDs);
                  const body = {
                    groupID: this.groupName,
                    Matched: this.songIDs,
                  };
                  this.http.put<Group>(url, body, options).subscribe(
                    (res) => {
                      console.log(res);
                      this.allOfMyGroupNames.push(this.groupName);
                      this.justGetGroups();
                    },
                    (err) => console.log(err)
                  );

                  this.spotifyService
                    .addSongs(this.user, this.selectedPlaylistId, songs) // ERROR HERE
                    .subscribe((response) => {});
                }
              });
          }
        });
      });
  }

  justGetGroups(): void {
    console.log(this.allOfMyGroupNames);
    for (const groupName of this.allOfMyGroupNames) {
      const url = `http://localhost:8000/groupPost/${groupName}`;
      this.http.get<Group>(url).subscribe((group: Group) => {
        this.allOfMyGroups.push(group);
      });
    }
  }

  playlistExists: boolean = false;
  playlistID: string = '';
  groupMatchedSongs: string[] = [];
  notInPlaylist: string[] = [];

  getAllGroups(): void {
    // add functionality to check if the users playlist exists in their spotify account if not create it. If it is there then dipslay what songs differ between there playlist and matched and have a button to add those songs into playlist accordingly.
    console.log(this.allOfMyGroupNames);
    for (const groupName of this.allOfMyGroupNames) {
      const url = `http://localhost:8000/groupPost/${groupName}`;
      this.http.get<Group>(url).subscribe(
        (group: Group) => {
          this.allOfMyGroups.push(group);
          this.groupMatchedSongs = group.matched;
          this.playlistExists = false;
          console.log(groupName);
          for (let playlist of this.playlists) {
            if (playlist.name === group.playlistID) {
              console.log('Else ran - playlist exists');
              this.playlistExists = true;
            }
          }

          console.log(this.playlistExists);

          if (this.playlistExists === false) {
            console.log('If ran - playlist does not exist');
            this.spotifyService
              .createPlaylist(group.playlistID, this.userIds, this.user)
              .then(() => {
                this.spotifyService
                  .getPlaylists(this.user)
                  .subscribe((playlists) => {
                    this.playlists = playlists;
                    const selectedPlaylist = this.playlists.find(
                      (playlist) => playlist.name === group.playlistID
                    );
                    console.log(
                      'found playlist after creating it: ',
                      selectedPlaylist
                    );
                    this.createdPlaylistID =
                      selectedPlaylist?.id || 'defaultPlaylistId';
                    console.log('created Playlist ID', this.createdPlaylistID);
                    console.log('songs in Database: ', this.groupMatchedSongs);
                    const songsA = {
                      uris: this.groupMatchedSongs.map(
                        (song) => `spotify:track:${song}`
                      ),
                    };
                    this.spotifyService
                      .addSongs(this.user, this.createdPlaylistID, songsA)
                      .subscribe((response) => {});
                  });
              });
          } else {
            this.spotifyService
              .getPlaylists(this.user)
              .subscribe((playlists) => {
                this.playlists = playlists;
                console.log(this.playlistName);
                const selectedPlaylist = this.playlists.find(
                  (playlist) => playlist.name === group.playlistID
                );
                this.createdPlaylistID =
                  selectedPlaylist?.id || 'defaultPlaylistId';
                console.log('created Playlist ID', this.createdPlaylistID);
                if (selectedPlaylist) {
                  // error here
                  console.log('THIS RAN'); //  PLAYLIST IS NOT ABLE TO EXTRACT THE SONGS FROM THE PLAYLIST need to fix this
                  this.spotifyService
                    .getSongs(this.user, this.createdPlaylistID)
                    .subscribe((allSongs) => {
                      console.log('All songs in playlist:', allSongs); // LEFT OFF HERE
                      this.notInPlaylist = this.groupMatchedSongs
                        .filter(
                          (songID) =>
                            !allSongs.some((song) => song.id === songID)
                        )
                        .map((songName) => `spotify:track:${songName}`);
                      const songsA = {
                        uris: this.notInPlaylist,
                      };
                      console.log('Songs not in playlist:', this.notInPlaylist);
                      if (this.createdPlaylistID && songsA.uris.length > 0) {
                        console.log('Songs were added to playlist');
                        this.spotifyService
                          .addSongs(this.user, this.createdPlaylistID, songsA)
                          .subscribe((response) => {});
                      }
                    });
                }
              });
          }
        },
        (error: any) => console.log(error)
      );
    }
  }

  getUser(): Observable<boolean> {
    const url = `http://localhost:8000/userPost/${this.user}`;
    return this.http.get(url).pipe(
      map((data: any) => {
        // Check if user ID exists
        console.log(data.friends);
        if (data.friends) {
          this.friendsUserId = [...this.friendsUserId, ...data.friends];
        }
        if (data.groups) {
          this.allOfMyGroupNames = [...this.allOfMyGroupNames, ...data.groups];
        }

        return true;
      }),
      catchError((error: any) => {
        console.error(error);
        return of(false);
      })
    );
  }

  handleAuth() {
    // NEXT CHANGE HERE
    this.spotifyService.handleAuthorizationResponse().then(() => {
      this.spotifyService.getUserId().subscribe((user) => {
        this.user = user;
        this.spotifyService.getPlaylists(this.user).subscribe((playlists) => {
          this.playlists = playlists;
          this.getUser().subscribe((userExists) => {
            if (userExists) {
              console.log('User exists');
            } else {
              this.addUser();
              console.log('User does not exist');
            }
            this.getAllGroups();

            // CHECK IF PLAYLIST EXISTS OR NOT

            //Add functionaluty
            this.showGroupList = true;
          });
        });
      });
    });
  }

  redirectToSpotifyAPI() {
    this.spotifyService.authorize();
  }

  addUser(): void {
    console.log('RAN POST');

    const body = {
      Friends: this.friendsUserId, // just stores the friends name
      //LikedSong: ["song1", "song2", "song3"],
      UserID: this.user,
      //groupAdmin: { "BINGO": true, "GROUP2": false }
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    this.http
      .post<User>('http://localhost:8000/userPost', body, options)
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }

  onSubmit() {
    // displays the songs and makes post request

    this.spotifyService
      .getRandomSongsFromRapCategory()
      .subscribe((playlists) => {
        // PRETTY CONFIDENT ABT THIS BUT NOT ANYTHING ELSE
        this.randomP = playlists;

        const firstPlaylist = this.randomP[0];

        console.log(firstPlaylist); //does not work during first try - works second try
        console.log(firstPlaylist.songs);

        const playlistContainer = document.querySelector('.song-card');
        this.randomActualSongs = this.randomP[0]; // something wrong here

        console.log(this.randomActualSongs.songs); //does not work at all

        //ERROR HERE:  this.randomP does not update immdietly for use afterwards. this.randomActual songs also does not update immdietly for use afterwards. please fix this code

        if (!playlistContainer) {
          console.error('No .playlist-container element was found in the DOM.');
          return;
        }

        if (this.randomActualSongs?.songs) {
          const song = this.randomActualSongs.songs[this.myNumber];
          if (song) {
            console.log('RAN ONCE');
            const songContainer = document.createElement('div');
            songContainer.classList.add('song-container');

            const songImage = document.createElement('img');
            songImage.src = song.imageUrl;

            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = song.audioUrl;
            audioPlayer.style.position = 'absolute';
            audioPlayer.style.left = '820px';
            audioPlayer.style.top = '280px';

            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.position = 'relative';
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.flexDirection = 'column';
            buttonsContainer.classList.add('buttons-container');

            const likeButton = document.createElement('button');
            likeButton.innerText = 'Like';
            likeButton.style.position = 'absolute';
            likeButton.style.bottom = '0';
            likeButton.style.right = '0';
            likeButton.addEventListener('click', () => {
              this.addSong(song.id, this.selectedGroupID);

              this.arbAddSongs[0] = song;
              const songsA = {
                uris: this.arbAddSongs.map(
                  (song) => `spotify:track:${song.id}`
                ),
              };
              if (this.selectedGroupPlaylist) {
                this.spotifyService
                  .addSongs(this.user, this.selectedGroupPlaylist.id, songsA)
                  .subscribe((response) => {});
              }
              if (this.randomActualSongs?.songs) {
                // Increment myNumber to get the next song
                this.myNumber =
                  (this.myNumber + 1) % this.randomActualSongs?.songs.length;
                // Remove the current song container
                songContainer.remove();
                // Display the next song
                this.displaySong();
              }
            });

            const dislikeButton = document.createElement('button');
            dislikeButton.innerText = 'Dislike';
            dislikeButton.style.position = 'absolute';
            dislikeButton.style.bottom = '0';
            dislikeButton.style.left = '0';
            dislikeButton.addEventListener('click', () => {
              if (this.randomActualSongs?.songs) {
                // Increment myNumber to get the next song
                this.myNumber =
                  (this.myNumber + 1) % this.randomActualSongs.songs.length;
                // Remove the current song container
                songContainer.remove();
                // Display the next song
                this.displaySong();
              }
            });

            buttonsContainer.appendChild(likeButton);
            buttonsContainer.appendChild(dislikeButton);

            songContainer.appendChild(audioPlayer);
            songContainer.appendChild(songImage);
            //songContainer.appendChild(audioPlayer);
            songContainer.appendChild(buttonsContainer);

            playlistContainer.appendChild(songContainer);
          }
        } else {
          console.error('this.randomActualSongs.songs is undefined');
        }
      });
  }

  navigateToNewScreen() {
    this.router.navigate(['/home-screen']);
  }
}
