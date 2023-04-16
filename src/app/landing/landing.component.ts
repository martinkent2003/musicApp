import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  // An array of quotes by famous musicians that contain the word "vibe".
  quotes: string[] = [
    '"Vibe is everything❗️" - Pharrell Williams',
    '"Everything is vibration [Vibez] 🔬" - Albert Einstein',
    '"I\'m just trying to vibe out and eat some good food 🍕" - Post Malone',
    '"I like my music to have the right kind of vibe, like a good soup 🍜" - Anderson .Paak',
    '"I\'m all about good vibes and high fives 🖐️" - Janelle Monae',
    '"When I\'m writing music, I\'m just trying to get in a good vibe and make something that feels good 🤩" - Charlie Puth',
    '"I try to keep my vibe as good as possible, and usually that means keeping my shoes fresh 👟" - Travis Scott',
    '"I like to vibe out with my guitar and see where it takes me 🎸" - John Mayer',
  ];

  // The index of the current quote being displayed.
  currentQuoteIndex: number = 0;

  // The HTML element that will display the quotes.
  quoteElement!: HTMLElement;

  ngOnInit() {
    // This line of code gets the quote element from the DOM by its ID using the getElementById method.
    /* The '!' symbol is a non-null assertion operator in TypeScript that tells the compiler that we are certain
     that the value of the expression on the left side is not null or undefined. In this case, we use it to assert
      that the element with the 'quote-text' ID exists in the DOM and is not null or undefined. */
    this.quoteElement = document.getElementById('quote-text')!;
    // The time interval is set to 4500 milliseconds (4.5 seconds) to allow for a smooth and natural transition between quotes.
    setInterval(() => {
      this.currentQuoteIndex++;
      if (this.currentQuoteIndex >= this.quotes.length) {
        this.currentQuoteIndex = 0;
      }
      // If the quote element exists, display the current quote.
      if (this.quoteElement) {
        this.quoteElement.innerHTML = this.quotes[this.currentQuoteIndex];
      }
    }, 5000);
  }
}
