// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/spotifyservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private spotifyService: SpotifyService) {}

  ngOnInit() {}

  redirectToSpotifyAPI() {
    this.spotifyService.authorize();
  }

  async handleAuth() {
    await this.spotifyService.handleAuthorizationResponse();
    const userId = await this.spotifyService.getUserId().toPromise();
    this.router.navigate(['/home-screen'], { queryParams: { userId: userId } });
  }

}
