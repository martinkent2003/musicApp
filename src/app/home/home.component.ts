import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email: string = '';
  password: string = '';
  constructor(){}
  onSubmit() {
    console.log(`Email: ${this.email}`);
    console.log(`Password: ${this.password}`);
    // Here you can perform the login logic, e.g. sending the data to a server
  }
}
