//spotifyservice.ts
import { Injectable } from '@angular/core';
// Importing the Injectable decorator from the Angular Core module, which marks the class as an injectable service.

import { HttpClient, HttpHeaders } from '@angular/common/http';
// Importing the HttpClient and HttpHeaders classes from the Angular Common HTTP module, which allow us to make HTTP requests to external APIs.

import { Router } from '@angular/router';
// Importing the Router class from the Angular Router module, which provides the navigation and URL manipulation capabilities for the application.

import { forkJoin, Observable, of } from 'rxjs';
// Importing the forkJoin, Observable, and of functions from the RxJS library, which provide various utilities for working with asynchronous data streams.

import { catchError, map, switchMap, tap } from 'rxjs/operators';
// Importing several operators from the RxJS library, which we can use to transform and manipulate the data emitted by our observables.

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI_LOGIN } from './environment';
// Importing three constants from a local file, which contain our Spotify API client ID and secret, as well as the redirect URI for the login process.

// defines the structure of a playlist object
interface Playlist {
  songs: Song[];
  id: string;
  name: string;
}

interface Song {
  id: string;
  name: string;
  imageUrl: string;
  audioUrl: string;

  // other properties of a song
}
interface SongResponse {
  id: string;
  name: string;
  imageUrl: string;
  audioUrl: string;
  // other properties of a song returned by the Spotify API
}

interface CategoryResponse {
  id: string;
  name: string;
}

/**
 * The @Injectable decorator in this code snippet is used to
 *  register the service class with the Angular Dependency
 *  Injection (DI) system. The providedIn property specifies
 *  the scope of the service instance.
 */
@Injectable({
  providedIn: 'root',
  //one instance of the service created, and it is shared across all components and modules that use it.
})
export class SpotifyService {
  accessToken: string = '';
  private apiBaseUrl = 'https://api.spotify.com/v1/';
  user: String = '';

  constructor(private http: HttpClient, private router: Router) {}

  /***
   * function is responsible for initiating the Spotify authorization process.
   *  It constructs a URL for the Spotify authorization page with the required
   *  parameters and sets the current window location to this URL, which will
   *  cause the user's browser to redirect to the Spotify authorization page.
   */
  authorize(): Observable<any> {
    const scope =
      'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative user-library-modify';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_LOGIN}&scope=${scope}&response_type=code`;
    return of({});
    //convert the function into an observable, allowing other parts of the application to subscribe to it
    // and perform actions when the authorization process completes
  }

  /***
   * When the user is redirected back to the application from the Spotify authorization page,
   *  the URL includes a query parameter code with the authorization code that can be used
   *  to obtain an access token from the Spotify API.
   */
  private getCodeFromRedirectUri(): string | null {
    const url = new URL(window.location.href); //gets current window and creates URL object
    const code = url.searchParams.get('code'); // extract the value of the code parameter from the URL query string
    return code || null; //If the code parameter exists in the query string, its value is returned. Otherwise, the function returns null
  }

  async handleAuthorizationResponse() {
    // This function is responsible for handling the authorization response received from Spotify API.
    // It first calls the getCodeFromRedirectUri function to get the authorization code from the URL.
    const code = this.getCodeFromRedirectUri();
    if (!code) {
      // If code is null, then there is no authorization code available in the URL, so return early.
      return;
    }

    // If an authorization code is available, then create the headers object required for making a POST request to the Spotify API.
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    try {
      // Make a POST request to the Spotify API to exchange the authorization code for an access token.
      const response = await this.http
        .post<{ access_token: string }>(
          'https://accounts.spotify.com/api/token',
          `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI_LOGIN}`,
          { headers }
        )
        .toPromise();
      if (response) {
        // If a response is received, extract the access token from it and store it in the accessToken property of this class.
        this.accessToken = response.access_token;
      }
      // After successful login, redirect the user to the home page of the application.
      this.router.navigate(['/']); //TODO: if you want it to redirect to another component enter it after / | ex. '/home'
    } catch (error) {
      // If there is an error, log it to the console.
      console.error(error);
    }
  }

  getUser(userId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get(`https://api.spotify.com/v1/users/${userId}`, {
      headers,
    });
  }

  getUserId() {
    //console.log("happy")
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<any>(`https://api.spotify.com/v1/me`, { headers })
      .pipe(
        map((response) => {
          return response.id;
        })
      );
  }

  getPlaylists(userId: string): Observable<Array<Playlist>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http
      .get<any>(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers,
      })
      .pipe(
        map((response) => {
          return response.items.map((playlist: any) => {
            return {
              songs: this.getSongs(userId, playlist.name), // IDK IF THIS IS STILL NECESSARY BUT LEAVE IT FOR NOW
              id: playlist.id,
              name: playlist.name,
            } as unknown as Playlist;
          });
        })
      );
  }

  createPlaylist(name: string, userIds: string[], username: string) {
    //userIds pointless bc only owner can edit the playlist

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.accessToken}`
    );
    console.log(username);
    const userId = username; // CHANGE THIS TO BE DYNAMIC BY SOMEHOW CALLING GETUSERID
    const url = `${this.apiBaseUrl}users/${userId}/playlists`;
    const body = {
      name: name,
      public: false,
      collaborative: true,
    };

    return this.http.post<any>(url, body, { headers }).toPromise();
    //no point in adding collaborators bc only owner can edit the playlist anyways
  }

  songs = {
    uris: [],
  };
  addSongs(userId: string, playlistId: string, songs: { uris: string[] }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks/`,
      songs,
      { headers }
    );
  }

  getCategoryId(categoryName: string): Observable<string | null> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.accessToken}`
    );

    return this.http
      .get<{ categories: { items: CategoryResponse[] } }>(
        `https://api.spotify.com/v1/browse/categories`,
        { headers }
      )
      .pipe(
        map((response) => {
          const categories = response.categories.items;
          const category = categories.find(
            (categoryResponse) => categoryResponse.name === categoryName
          );
          return category ? category.id : null;
        })
      );
  }

  getRandomSongsFromRapCategory(): Observable<Playlist[]> {
    return this.getCategoryId('Pop').pipe(
      switchMap((rapCategoryId) => {
        if (!rapCategoryId) {
          return of([]);
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.accessToken}`,
        });

        return this.http
        .get<any>(
          `https://api.spotify.com/v1/browse/categories/${rapCategoryId}/playlists`,
          { headers }
        )
        .pipe(
          switchMap((response) => {
            const playlistObservables = response.playlists.items.map(
              (playlist: {
                uri: any;
                id: string;
                name: string;
                imageURL: string;
              }) => {
                // Fetch the playlist ID from the 'uri' property
                const id = playlist.uri.split(':')[2];
                return this.getSongsFromPlaylist(id).pipe(
                  map((songs) => {
                    // Randomize the order of songs
                    for (let i = songs.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [songs[i], songs[j]] = [songs[j], songs[i]];
                    }
                    return {
                      id: id,
                      name: playlist.name,
                      songs: songs,
                    } as Playlist;
                  })
                );
              }
            );
            return forkJoin(playlistObservables);
          }),
          map((playlists) => playlists as Playlist[])
        );
      
      })
    );
  }

  getSongsFromPlaylist(playlistId: string): Observable<Array<Song>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<any>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers,
      })
      .pipe(
        map((response) => {
          return response.items.map((song: any) => {
            return {
              id: song.track.id,
              name: song.track.name,
              imageUrl: song.track.album.images[0].url,
              audioUrl: song.track.preview_url,
            } as Song;
          });
        })
      );
  }

  // This function retrieves an array of Song objects from a specific Spotify playlist.
  // It takes in a userId and a playlistId as parameters.
  getSongs(userId: string, playlistId: string): Observable<Array<Song>> {
    // Set the authorization header to include the access token.
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    // Make an HTTP GET request to the Spotify API, passing in the user ID and playlist ID in the URL.
    return this.http
      .get<any>(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        { headers }
      )
      .pipe(
        // Use the RxJS map operator to transform the response into an array of Song objects.
        map((response) => {
          return response.items.map((tracks: any) => {
            return {
              id: tracks.track.id,
              name: tracks.track.name,
              imageUrl: tracks.imageUrl,
              audioUrl: tracks.audioUrl,
            } as Song;
          });
        })
      );
  }
}
