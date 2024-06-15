import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-numbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './numbers.component.html',
  styleUrl: './numbers.component.css'
})
export class NumbersComponent {
  numbers = Array.from(Array(101), (_, i) => i.toString());
  numberInWords: string = '';
  searchNumber = '';
  searchResults: string[] = [];

  @ViewChild('numberInWordsElement', { static: true }) numberInWordsElement!: ElementRef;

  @HostListener('window:keydown', ['$event'])
handleKeydown(event: KeyboardEvent) {
  console.log('Keydown event triggered!');
  const number = event.key;
  console.log(`Key pressed: ${number}`);
  if (parseInt(number) >= 0 && parseInt(number) <= 9) {
    console.log('Number is within range');
    const audio = new Audio(`assets/audio/mp3/${number}.mp3`);
    audio.play();
    const numberInWords = this.num2words(parseInt(number)) ?? '';
    console.log(`Number in words: ${numberInWords}`);
    this.numberInWordsElement.nativeElement.innerText = numberInWords;
    console.log('Updated text content');
  } else {
    console.log('Number is out of range');
  }
}

  playAudio(number: string) {
    const audio = new Audio(`assets/audio/mp3/${number}.mp3`);
    audio.play();
    this.numberInWords = this.num2words(parseInt(number));
    this.numberInWordsElement.nativeElement.innerText = this.numberInWords;
  }

  searchNumberInArray() {
    this.searchResults = this.numbers.filter(number => number.includes(this.searchNumber));
  }

  num2words(n: number): string {
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const hundreds = ['', 'one hundred', 'two hundred'];

    if (n < 10) {
      return ones[n];
    } else if (n < 20) {
      return teens[n - 10];
    } else if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    } else if (n < 101) {
      return hundreds[Math.floor(n / 100)] + (n % 100 ? ' and ' + this.num2words(n % 100) : '');
    } else {
      return 'Not implemented';
    }
  }
}

