// // login.component.ts
// import { Component, Input, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, map, Observable, of, switchMap } from 'rxjs';
// import { SpotifyService } from 'src/spotifyservice';
// import { from } from 'rxjs';
// interface Playlist {
//   id: string;
//   name: string;
//   songs: Song[];
// }

// interface User {
//   Friends: string[];
//   LikedSong: string[];
//   UserID: string;
//   groupAdmin: Record<string, boolean>;
// }

// interface Song {
//   id: string;
//   name: string;
//   imageUrl: string;
//   audioUrl: string;
// }

// const url = 'http://localhost:8000/groupPost';

// const groupData = {
//   groupID: 'exampleGroup',
//   users: ['user1', 'user2', 'user3'],
// };

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent implements OnInit {
//   playlists: Array<Playlist> = [];
//   user: string = '';
//   dropDown: string = '';
//   friendsUserId: string[] = [];

//   constructor(
//     private router: Router,
//     private http: HttpClient,
//     private spotifyService: SpotifyService
//   ) {}

//   ngOnInit() {}

//   redirectToSpotifyAPI() {
//     this.spotifyService.authorize();
//   }

//   handleAuth() {
//     // gets acess token
//     this.spotifyService.handleAuthorizationResponse().then(() => {
//       this.spotifyService.getUserId().subscribe((user) => {
//         this.user = user;
//         this.spotifyService.getPlaylists(this.user).subscribe((playlists) => {
//           this.playlists = playlists;
//           this.getUser().subscribe((userExists) => {
//             if (userExists) {
//               console.log('User exists');

//               // display user friends
//             } else {
//               console.log('User does not exist');
//               this.addUser();
//             }
//           });
//         });
//       });
//     });
//   }

//   getUser(): Observable<boolean> {
//     const url = `http://localhost:8000/userPost/${this.user}`;
//     return this.http.get(url).pipe(
//       map((data: any) => {
//         // Check if user ID exists
//         console.log(data);
//         this.friendsUserId = data.friends;
//         return true;
//       }),
//       catchError((error: any) => {
//         console.error(error);
//         return of(false);
//       })
//     );
//   }

//   addUser(): void {
//     console.log('RAN POST');

//     const body = {
//       Friends: this.friendsUserId, // just stores the friends name
//       //LikedSong: ["song1", "song2", "song3"],
//       username: this.user,
//       //groupAdmin: { "BINGO": true, "GROUP2": false }
//     };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     const options = { headers: headers };

//     this.http
//       .post<User>('http://localhost:8000/userPost', body, options)
//       .subscribe(
//         (res) => console.log(res),
//         (err) => console.log(err)
//       );
//   }
// }
