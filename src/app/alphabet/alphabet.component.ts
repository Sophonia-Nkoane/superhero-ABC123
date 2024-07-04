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
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // List of all alphabet letters
  searchLetter = ''; // Holds the current search query for letters
  selectedLetter = ''; // Stores the last selected letter
  filteredAlphabet: string[] = []; // Array to hold filtered alphabet letters
  mode = 'all'; // Mode toggle (all, alphabet, phonics, objects)
  searchLetterIcon = '';
  isReading = false; // Flag to indicate if the read all process is ongoing
  isAutoRead = false; // Flag to indicate if auto read is enabled

  iam = 'Browser';

  objects = [
    { letter: 'A', object: 'Apple', icon: '🍎' },
    { letter: 'B', object: 'Boy', icon: '👦' },
    { letter: 'C', object: 'Cat', icon: '🐈' },
    { letter: 'D', object: 'Dog', icon: '🐕' },
    { letter: 'E', object: 'Elephant', icon: '🐘' },
    { letter: 'F', object: 'Fish', icon: '🐟' },
    { letter: 'G', object: 'Girl', icon: '👧' },
    { letter: 'H', object: 'House', icon: '🏠' },
    { letter: 'I', object: 'Ice-cream', icon: '🍦' },
    { letter: 'J', object: 'Jet', icon: '🛩️' },
    { letter: 'K', object: 'Kite', icon: '🪁' },
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
    { letter: 'Z', object: 'Zebra', icon: '🦓' },
  ];

  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
    this.filteredAlphabet = this.alphabet.split(''); // Initialize filtered alphabet with all letters
  }


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

  updateSearchLetter(letter: string): void {
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase(); // Get uppercase letter from keypress
    if (this.alphabet.includes(letter)) { // Check if the pressed key is a valid alphabet letter
      this.searchLetter = letter; // Update searchLetter with the key pressed
      if (this.mode === 'all' && this.isAutoRead) {
        this.readAll(); // Call readAll method to read all letters automatically if auto read is enabled
      } else {
        this.playPhoneticSpeech(letter); // Call playPhoneticSpeech method to speak the phonetic sound and update searchLetter
      }
    }
  }

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

  toggleMode(mode: string): void {
    this.mode = mode;
    this.searchLetter = ''; // Clear search input when toggling modes
  }

  toggleAutoRead(): void {
    this.isAutoRead = !this.isAutoRead;
    if (this.isAutoRead) {
      this.readAll(); // Start reading all items automatically if auto read is enabled
    } else {
      this.stopReading(); // Stop reading if auto read is disabled
    }
  }

  readAll(): void {
    this.isReading = true;
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < this.filteredAlphabet.length && this.isReading) {
        const letter = this.filteredAlphabet[index];
        this.playPhoneticSpeech(letter); // Play phonetic sound and update searchLetter
        index++;
      } else {
        clearInterval(intervalId); // Stop the interval when all items are read
        this.stopReading();
      }
    }, 5000); // Adjust the interval time as needed
  }

  stopReading(): void {
    this.isReading = false; // Set isReading flag to false
    console.log('Stopped reading.');
  }
}
