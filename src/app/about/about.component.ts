// TypeScript code
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Michael Shaffer',
      image: 'https://i.imgur.com/ilNhW13.png',
      role: 'Frontend Engineer',
    },
    {
      name: 'Akshat Pant',
      image: 'https://i.imgur.com/7g6YRaT.png',
      role: 'Frontend Engineer',
    },
    {
      name: 'Martin Kent',
      image: 'https://i.imgur.com/S4PAtPy.png',
      role: 'Backend Engineer',
    },
    {
      name: 'Aryaan Verma',
      image: 'https://i.imgur.com/bdxEgO2.png',
      role: 'Backend Engineer',
    },
  ];
}
