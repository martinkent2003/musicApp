import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  email: string = '';
  password: string = '';
  constructor() {}
  onSubmit() {
    console.log(`Email: ${this.email}`);
    console.log(`Password: ${this.password}`);
    // Here you can perform the login logic, e.g. sending the data to a server
  }
}
