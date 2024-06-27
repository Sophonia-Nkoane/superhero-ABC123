import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-numbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.css']
})
export class NumbersComponent {
  // Array of numbers from 0 to 100 as strings, excluding 101
  numbers = Array.from({ length: 101 }, (_, i) => i.toString()).slice(0, 100);

  // Variable to hold the number in words representation
  numberInWords = '';

  // Variable to hold the user's search input
  searchNumber = '';

  // Array to hold the search results
  searchResults: string[] = [];

  // Initial increment value
  increment = '1';

  // Array of possible increment values
  increments = ['1', '2', '5', '10', '20'];

  // Reference to the DOM element displaying the number in words
  @ViewChild('numberInWordsElement', { static: true }) numberInWordsElement!: ElementRef;

  // Listen for keydown events on the window
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const number = event.key;
    // Check if the key pressed is a valid number key
    if (this.isValidNumberKey(number)) {
      // Play the corresponding audio and display the number in words
      this.playNumberAudio(number);
    }
  }

  // Method to set the increment value
  toggleIncrement(increment: string) {
    this.increment = increment;
  }

  // Method to get an array of numbers based on the current increment value
  getNumbers() {
    const incrementValue = parseInt(this.increment);
    // Generate the array based on the increment value, ensuring it excludes 101
    return Array.from({ length: Math.floor(100 / incrementValue) + 1 }, (_, i) => (i * incrementValue).toString());
  }

  // Method to play the audio for a given number and display its word representation
  playAudio(number: string) {
    const audio = new Audio(`assets/audio/number/${number}.mp3`);
    audio.play();
    this.numberInWords = this.num2words(parseInt(number));
    this.updateNumberInWordsElement();
  }

  // Method to filter the numbers array based on the user's search input
  searchNumberInArray() {
    this.searchResults = this.numbers.filter(number => number.includes(this.searchNumber));
  }

  // Private method to convert a number to its word representation
  private num2words(n: number): string {
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const hundreds = ['one hundred'];

    if (n < 10) return ones[n]; // Return the word for numbers 0-9
    if (n < 20) return teens[n - 10]; // Return the word for numbers 10-19
    if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`; // Return the word for numbers 20-99
    if (n === 100) return hundreds[0]; // Return the word for 100

    return 'Not implemented'; // Default return for unsupported numbers
  }

  // Private method to check if a key is a valid number key
  private isValidNumberKey(key: string): boolean {
    const num = parseInt(key);
    return !isNaN(num) && num >= 0 && num <= 9; // Check if the key is a number between 0 and 9
  }

  // Private method to play the audio for a given number and update the number in words element
  private playNumberAudio(number: string) {
    const audio = new Audio(`assets/audio/number/${number}.mp3`);
    audio.play(); // Play the corresponding audio file
    this.numberInWords = this.num2words(parseInt(number)); // Convert the number to words
    this.updateNumberInWordsElement(); // Update the DOM element with the number in words
  }

  // Private method to update the inner text of the number in words element
  private updateNumberInWordsElement() {
    this.numberInWordsElement.nativeElement.innerText = this.numberInWords; // Update the text content of the element
  }
}
