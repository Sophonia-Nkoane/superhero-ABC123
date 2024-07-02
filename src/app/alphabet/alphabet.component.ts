import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrl: './alphabet.component.css'
})
export class AlphabetComponent {
  // Properties
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // List of all alphabet letters
  searchLetter = ''; // Holds the current search query for letters
  selectedLetter = ''; // Stores the last selected letter
  filteredAlphabet: string[] = []; // Array to hold filtered alphabet letters
  mode = 'all'; // Mode toggle (all, alphabet, phonics, objects)
  searchLetterIcon = '';
  isReading = false; // Flag to indicate if the read all process is ongoing

  objects = [
    { letter: 'A', object: 'Apple', icon: '🍎' },
    { letter: 'B', object: 'Boy', icon: '👦' },
    { letter: 'C', object: 'Cat', icon: '🐈' },
    { letter: 'D', object: 'Dog', icon: '🐕' },
    { letter: 'E', object: 'Elephant', icon: '🐘' },
    { letter: 'F', object: 'Fish', icon: '🐟' },
    { letter: 'G', object: 'Girl', icon: '👧' },
    { letter: 'H', object: 'House', icon: '🏠' },
    { letter: 'I', object: 'Igloo', icon: '🏠️' },
    { letter: 'J', object: 'Jet', icon: '🛩️' },
    { letter: 'K', object: 'Kite', icon: '🎯' },
    { letter: 'L', object: 'Lion', icon: '🦁' },
    { letter: 'M', object: 'Mouse', icon: '🐭' },
    { letter: 'N', object: 'Nose', icon: '👃' },
    { letter: 'O', object: 'Ocean', icon: '🌊' },
    { letter: 'P', object: 'Penguin', icon: '🐧' },
    { letter: 'Q', object: 'Queen', icon: '👑' },
    { letter: 'R', object: 'Robot', icon: '🤖' },
    { letter: 'S', object: 'Sun', icon: '☀️' },
    { letter: 'T', object: 'Tiger', icon: '🐯' },
    { letter: 'U', object: 'Umbrella', icon: '☔️' },
    { letter: 'V', object: 'Violin', icon: '🎻' },
    { letter: 'W', object: 'Whale', icon: '🐳' },
    { letter: 'X', object: 'X-ray', icon: '🔍' },
    { letter: 'Y', object: 'Yacht', icon: '🛥️' },
    { letter: 'Z', object: 'Zebra', icon: '🦒' },
  ]

  constructor(private voiceService: VoiceService) {}

  // Lifecycle hook to initialize component
  ngOnInit() {
    this.filteredAlphabet = this.alphabet.split(''); // Initialize filtered alphabet with all letters
  }

  // Method to play phonetic speech for a specific letter and update selectedLetter and searchLetter
  playPhoneticSpeech(letter: string): void {
    if (this.mode === 'all' || this.mode === 'alphabet') {
      this.playAlphabetSound(letter);
    }
    if (this.mode === 'all' || this.mode === 'phonics') {
      this.playPhoneticSound(letter);
    }
    if (this.mode === 'all' || this.mode === 'objects') {
      const object = this.objects.find(obj => obj.letter === letter);
      if (object) {
        this.voiceService.playText(object.object);
        if (this.mode === 'all') {
          this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()} - ${object.object} ${object.icon}`;
        } else {
          this.searchLetter = `${object.object} ${object.icon}`;
        }
      }
    }
    this.selectedLetter = letter;
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.updateSearchLetter(letter);
    }
  }

  playAlphabetSound(letter: string): void {
    this.voiceService.playText(letter);
  }

  playPhoneticSound(letter: string): void {
    const phonetic = this.voiceService.getPhonetic(letter);
    this.voiceService.playText(phonetic);
  }

  // Method to update searchLetter with both uppercase and lowercase versions of the letter
  updateSearchLetter(letter: string): void {
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
    }
  }

  // HostListener for keypress event to handle playing phonetic speech and updating searchLetter
  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase(); // Get uppercase letter from keypress
    if (this.alphabet.includes(letter)) { // Check if the pressed key is a valid alphabet letter
      this.playPhoneticSpeech(letter); // Call playPhoneticSpeech method to speak the phonetic sound and update searchLetter
    }
  }

  // Method to filter alphabet based on searchLetter
  filterAlphabet(): void {
    this.filteredAlphabet = this.alphabet.split('').filter(letter =>
      letter.includes(this.searchLetter.toUpperCase()) // Filter alphabet based on searchLetter
    );
  }

  getObject(letter: string): string {
    const object = this.objects.find(obj => obj.letter === letter);
    return object ? object.object : '';
  }

  getObjectIcon(letter: string): string {
    const object = this.objects.find(obj => obj.letter === letter);
    return object ? object.icon : '';
  }

  // Toggle mode
  toggleMode(mode: string): void {
    this.mode = mode;
    this.searchLetter = ''; // Clear search input when toggling modes
  }

  readAll(): void {
    if (this.isReading) return; // Prevent multiple triggers
    this.isReading = true;
    this.toggleMode('all'); // Ensure we are in 'all' mode

    const readBatch = async (start: number, end: number) => {
      for (let i = start; i < end; i++) {
        if (i >= this.filteredAlphabet.length) {
          this.isReading = false;
          this.retheme(false); // Revert the theme after reading all letters
          return;
        }
        const letter = this.filteredAlphabet[i];
        this.playPhoneticSpeech(letter);
        await this.delay(7000); // 2 seconds delay between each letter
      }
      if (end < this.filteredAlphabet.length) {
        setTimeout(() => readBatch(end, end + 5), 2000); // 2 seconds delay before next batch
      } else {
        this.isReading = false;
        this.retheme(false); // Revert the theme after reading all letters
      }
    };

    this.retheme(true); // Apply the theme before starting
    readBatch(0, 5); // Start reading from the first batch of 5 letters
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to apply or revert a theme
  retheme(apply: boolean): void {
    const body = document.body;
    if (apply) {
      body.classList.add('reading-mode');
    } else {
      body.classList.remove('reading-mode');
    }
  }
}
