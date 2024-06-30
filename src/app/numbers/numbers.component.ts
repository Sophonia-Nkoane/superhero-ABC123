import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-numbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.css']
})
export class NumbersComponent {
  // Array of numbers from 0 to 100 as strings
  numbers = Array.from({ length: 101 }, (_, i) => i.toString()).slice(0, 100);
  // Variable to hold the number in words representation
  numberInWords = '';
  // Variable to hold the current number
  currentNumber = '';
  // Array to hold the search results
  searchResults: string[] = [];
  // Initial increment value
  increment = '1';
  // Array of possible increment values
  increments = ['1', '2', '5', '10', '20'];
  // Language selection
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  languages = ['English', 'Afrikaans', 'Zulu'] as const;

  // Reference to the DOM element displaying the number in words
  @ViewChild('numberInWordsElement', { static: true }) numberInWordsElement!: ElementRef;
  @ViewChild('currentNumberElement', { static: true }) currentNumberElement!: ElementRef;

  constructor(private voiceService: VoiceService) {}

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

  // Method to convert a number to its word representation
  num2words(n: number): string {
    const ones: Record<typeof this.language, string[]> = {
      English: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
      Afrikaans: ['nul', 'een', 'twee', 'drie', 'vier', 'vyf', 'ses', 'sewe', 'agt', 'nege'],
      Zulu: ['iqanda', 'kunye', 'kubili', 'kuthathu', 'kune', 'kuyisihlanu', 'isithupha', 'isikhombisa', 'isishiyagalombili', 'isishiyagalolunye']
    };
    const teens: Record<typeof this.language, string[]> = {
      English: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
      Afrikaans: ['tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vyftien', 'sestien', 'sewentien', 'agtien', 'negentien'],
      Zulu: ['ishumi', 'ishumi nanye', 'ishumi nambili', 'ishumi nantathu', 'ishumi nane', 'ishumi nanhlanu', 'ishumi nesithupha', 'ishumi nesikhombisa', 'ishumi nesishiyagalombili', 'ishumi nesishiyagalolunye']
    };
    const tens: Record<typeof this.language, string[]> = {
      English: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
      Afrikaans: ['', '', 'twintig', 'dertig', 'veertig', 'vyftig', 'sestig', 'sewentig', 'tagtig', 'negentig'],
      Zulu: ['', '', 'amashumi amabili', 'amashumi amathathu', 'amashumi amane', 'amashumi amahlanu', 'amashumi ayisithupha', 'amashumi ayisikhombisa', 'amashumi ayisishiyagalombili', 'amashumi ayisishiyagalolunye']
    };
    const hundreds: Record<typeof this.language, string[]> = {
      English: ['one hundred'],
      Afrikaans: ['een honderd'],
      Zulu: ['ikhulu']
    };

    if (n < 10) return ones[this.language][n]; // Return the word for numbers 0-9
    if (n < 20) return teens[this.language][n - 10]; // Return the word for numbers 10-19
    if (n < 100) return `${tens[this.language][Math.floor(n / 10)]}${n % 10 ? ' ' + ones[this.language][n % 10] : ''}`; // Return the word for numbers 20-99
    if (n === 100) return hundreds[this.language][0]; // Return the word for 100

    return 'Not implemented'; // Default return for unsupported numbers
  }

  // Method to check if a key is a valid number key
  isValidNumberKey(key: string): boolean {
    const num = parseInt(key);
    return !isNaN(num) && num >= 0 && num <= 9; // Check if the key is a number between 0 and 9
  }

  // Method to play the audio for a given number and update the number in words element
  async playNumberAudio(number: string) {
    const num = parseInt(number);
    this.numberInWords = this.num2words(num);
    this.currentNumber = number;
    this.updateNumberInWordsElement();

    // Highlighting words as they are read
    this.voiceService.playWords([this.numberInWords, number],
      (word) => {
        if (word === this.numberInWords) {
          this.numberInWordsElement.nativeElement.classList.add('highlight');
        } else if (word === number) {
          this.currentNumberElement.nativeElement.classList.add('highlight');
        }
      },
      (word) => {
        if (word === this.numberInWords) {
          this.numberInWordsElement.nativeElement.classList.remove('highlight');
        } else if (word === number) {
          this.currentNumberElement.nativeElement.classList.remove('highlight');
        }
      }
    );

    // Animate elements
    await this.animateElement(this.numberInWordsElement.nativeElement, 1000);
    await this.animateElement(this.currentNumberElement.nativeElement, 1000);
  }


  // Method to update the inner text of the number in words element
  updateNumberInWordsElement() {
    this.numberInWordsElement.nativeElement.innerText = this.numberInWords; // Update the text content of the element
    this.currentNumberElement.nativeElement.innerText = this.currentNumber; // Update the text content of the element
  }

  // Method to animate an element with fade in, zoom in and out, and glow effect
  animateElement(element: HTMLElement, duration: number) {
    return new Promise<void>(resolve => {
      element.style.transition = `all ${duration}ms`;
      element.style.opacity = '0';
      element.style.transform = 'scale(0.5)';
      element.style.boxShadow = '0 0 0px yellow';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1.2)';
        element.style.boxShadow = '0 0 10px yellow';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          setTimeout(() => {
            element.style.boxShadow = '0 0 0px yellow';
            resolve();
          }, duration);
        }, duration);
      }, 0);
    });
  }

  // Method to change the language
  changeLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.language = language;
  }
}
