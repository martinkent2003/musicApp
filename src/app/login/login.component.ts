// login.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { SpotifyService } from 'src/spotifyservice';
import { from } from 'rxjs';
interface Playlist {
  id: string;
  name: string;
  songs: Song[];

  // other properties of a playlist
}

interface Group {
  groupID: string;
  users: string[];
}

interface Song {
  id: string;
  name: string;
  imageUrl: string,
  audioUrl: string


  // other properties of a song
}

const url = 'http://localhost:8000/groupPost';

const groupData = {
  "groupID": 'exampleGroup',
  "users": ['user1', 'user2', 'user3']
};


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
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
  friendsUserId: string[] =[];
  selectedFriend: string = '';
  selectedPlaylistF = '';
  semiMatchedSongs: Array<Song> = []; // make a get request to pull all of the semi matched songs to display to the user
  matchedOwner: Array<Song> = [];// makes get request and allow user to add matched songs to the playlist
  randomP: Playlist[] = [];
  randomActualSongs: Playlist | undefined;

  




  
  constructor(private router: Router, private http: HttpClient,private spotifyService: SpotifyService){
  }


  ngOnInit() {
    

  }
  addFriend(name: string) {
    if (name) {
      this.friendsUserId.push(name);
    }
  }



  onPlaylistSelected(playlistS: string) {
    //12153577671
    console.log('Playlist selected:', playlistS);
    //console.log(this.playlists);
    const selectedPlaylist = this.playlists.find(playlist => playlist.name === 'akshawtyy17');
    
    const blendP =  this.Fplaylists.find(playlist => playlist.name === playlistS);
    if (blendP) {
      
      console.log('Blend p works');


    }
    
    if (selectedPlaylist && blendP) {
        console.log('WORKED');
        console.log(blendP.name);
        this.selectedPlaylistId = selectedPlaylist.id;
        //console.log(this.selectedPlaylistId);
        this.blendPID = blendP.id;
        this.spotifyService.getSongs(this.selectedFriend, this.blendPID).subscribe(allSongs => {
        const playlista = this.Fplaylists.find(p => p.id === this.blendPID); // MBYY ISSUE STARTS HERE
        console.log(playlista?.id);

      if (playlista && allSongs) { // DOES NOT WORK HERE
          console.log(allSongs);
          const songs = {
            uris: allSongs.map(song => `spotify:track:${song.id}`)
          };
          //console.log(this.selectedFriend);
          this.spotifyService.addSongs(this.selectedFriend, this.selectedPlaylistId, songs) // ERROR HERE
          .subscribe(response => {
          //console.log(response);
      });
      }
      });
      }
    // run your code here
  }

  onFriendSelected(friend: string) {
      console.log('Friend selected:', friend);
      this.spotifyService.getPlaylists(friend).subscribe(playlists => {
      this.Fplaylists = playlists;
      this.selectedFriend = friend;

      

    });

    
    
  }




  // const url = 'http://localhost:8000/groupPost';

  // const groupData = {
  //   groupID: 'exampleGroup',
  //   users: ['user1', 'user2', 'user3']
  // };



getUserData() { // blend fucnitonality



    this.spotifyService.createPlaylist('akshawtyy17',this.userIds, this.user);
    // start by asking what playlists the user wants to blend 
    //start by blending the current users playlist

    
    console.log(this.user)
    this.spotifyService.getPlaylists(this.user).subscribe(playlists => {
      this.playlists = playlists;
      console.log(this.playlists);
      const selectedPlaylist = this.playlists.find(playlist => playlist.name === 'akshawtyy17');
      console.log(this.dropDown);
      const blendP =  this.playlists.find(playlist => playlist.name === this.dropDown);
      console.log(selectedPlaylist?.id) // not detecting playlist throwbacks
      console.log(blendP?.id)
      //console.log(selectedPlaylist?.id)
      if (selectedPlaylist && blendP) {
          this.selectedPlaylistId = selectedPlaylist.id;
          this.blendPID = blendP.id;
          this.spotifyService.getSongs(this.user, this.blendPID).subscribe(allSongs => {
          const playlist = this.playlists.find(p => p.id === this.selectedPlaylistId);
          console.log(playlist?.name)

        if (playlist && allSongs) {
            console.log(allSongs);
            const songs = {
              uris: allSongs.map(song => `spotify:track:${song.id}`)
            };
            this.spotifyService.addSongs(this.user, this.selectedPlaylistId, songs) // ERROR HERE
            .subscribe(response => {
            console.log(response);
        });
        }
        });
        }
    });

  
}

handleAuth() { // gets acess token

  //ashah03122003@gmail.com
  //ashah03122003@gmail.com
  this.spotifyService.handleAuthorizationResponse().then(() => {
    console.log(this.email)
    console.log(this.password)

        this.spotifyService.getUserId()
          .subscribe(user => {
            this.user = user;
            this.spotifyService.getPlaylists(this.user).subscribe(playlists => {
              this.playlists = playlists;
            });
          });
    });
  
}


redirectToSpotifyAPI(){
  this.spotifyService.authorize();

}


addPost(): void {
  const body = {
    groupID: "BINGO",
    users: ["user1", "user2", "user3"]
  };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = { headers: headers };

  this.http.post<Group>('http://localhost:8000/groupPost', body, options)
    .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
    );
}


  onSubmit() {

    this.addPost();
    //this.spotifyService.authorize(); // when page is redirected you loose the this.email and this.password information
    // this.spotifyService.getRandomSongsFromRapCategory().subscribe(songs => { //NOT WORKING BECAUSE GET CATEGORY ID NOT WORKING
    //   this.randomSongs = songs;
    //   console.log('getRandomSongs ran');
    // });
    this.spotifyService.getRandomSongsFromRapCategory().subscribe(playlists => { // PRETTY CONFIDENT ABT THIS BUT NOT ANYTHING ELSE
      this.randomP = playlists;
    });

    const firstPlaylist = this.randomP[0];
    console.log(firstPlaylist); //does not work during first try - works second try
    console.log(firstPlaylist.songs);
    

    const playlistContainer = document.querySelector('.song-card')
    this.randomActualSongs = this.randomP[0]; // something wrong here

    console.log(this.randomActualSongs.songs); //does not work at all 

    //ERROR HERE:  this.randomP does not update immdietly for use afterwards. this.randomActual songs also does not update immdietly for use afterwards. please fix this code

    if (!playlistContainer) {
      console.error('No .playlist-container element was found in the DOM.');
      return;
    }
    

    if (this.randomActualSongs.songs) {
      this.randomActualSongs.songs.forEach((song) => { // for each got some error
      console.log('RAN ONCE')
      const songContainer = document.createElement('div');
      songContainer.classList.add('song-container');
      
      const songImage = document.createElement('img');
      songImage.src = song.imageUrl;
      
      const likeButton = document.createElement('button');
      likeButton.innerText = 'Like';
      
      const dislikeButton = document.createElement('button');
      dislikeButton.innerText = 'Dislike';
      
      songContainer.appendChild(songImage);
      songContainer.appendChild(likeButton);
      songContainer.appendChild(dislikeButton);
      
      playlistContainer.appendChild(songContainer);
    });
    }else {
      console.error('firstPlaylist.songs is undefined');
    }

  
  }



    //console.log()
    // this.email = (<HTMLInputElement>document.getElementsByName('email')[0]).value;
    // this.password = (<HTMLInputElement>document.getElementsByName('password')[0]).value;
    // console.log(this.email);
    // console.log(this.password);

  


  like() {
    //console.log('Like song:', this.song.name);
  }

  dislike() {
    //console.log('Dislike song:', this.song.name);
  }


  navigateToNewScreen() {
    this.router.navigate(['/home-screen']);
  }
}