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
interface Song {
  id: string;
  name: string;
  imageUrl: string,
  audioUrl: string


  // other properties of a song
}



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
  randomSongs: Song[] = [];

  




  
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






addPost(): void {
  const body = {
    "title": "ARYAN VERMA",
    "text": "ARYAM VERMA"
  }
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = { headers: headers };

  this.http.post('http://localhost:8000/posts', body, options)
    .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
    );
}

getUserData() {



    //this.spotifyService.createPlaylist('akshawtyy17',this.userIds, this.user);

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





  



  //   this.spotifyService.getPlaylists(this.user).subscribe(playlists => {
  //   this.playlists = playlists;
  //   const selectedPlaylist = this.playlists.find(playlist => playlist.name === 'House/EDM');
  //   if (selectedPlaylist) {
  //     this.selectedPlaylistId = selectedPlaylist.id;
  //     this.spotifyService.getSongs('akshatpant3002', this.selectedPlaylistId).subscribe(songs => {
  //       //console.log(songs);
  //       this.songs = songs;
        
        
  //     });
  //   }
  // });

  

  
  // try {
    
  //   this.spotifyService.getUser('12153577671').subscribe(data => {
  //     console.log(data);
  //     this.userData = data;
  //   });
  // } catch (error) {
  //   console.error(error);
  // }

  // this.spotifyService.getPlaylists('12153577671').subscribe(playlists => {
  //   this.playlists = playlists;
  //   const selectedPlaylist = this.playlists.find(playlist => playlist.name === 'House/EDM');
  //   if (selectedPlaylist) {
  //     this.selectedPlaylistId = selectedPlaylist.id;
  //     this.spotifyService.getSongs('akshatpant3002', this.selectedPlaylistId).subscribe(songs => {
  //       //console.log(songs);
  //       this.songs = songs;
        
        
  //     });
  //   }
  // });

  //Some identity management solutions, such as Okta or OneLogin, offer automatic user provisioning, which allows you to automatically add users to your applications based on data from a central source, such as a database or HR system. However, this feature is not currently supported by the Spotify Web API.
  //
  //
  //

  

  
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

      // this.spotifyService.addUserToSpotifyDeveloperDashboard(this.email, this.password)
      // .subscribe(() => {
      //   this.spotifyService.getUserId()
      //     .subscribe(user => {
      //       this.user = user;
      //       this.spotifyService.getPlaylists(this.user).subscribe(playlists => {
      //         this.playlists = playlists;
      //       });
      //     });
      // });
  
  




  
}


redirectToSpotifyAPI(){
  this.spotifyService.authorize();

}





  onSubmit() {
    //this.spotifyService.authorize(); // when page is redirected you loose the this.email and this.password information
    this.spotifyService.getRandomSongsFromRapCategory().subscribe(songs => { //NOT WORKING BECAUSE GET CATEGORY ID NOT WORKING
      this.randomSongs = songs;
      console.log('getRandomSongs ran');
    });
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
