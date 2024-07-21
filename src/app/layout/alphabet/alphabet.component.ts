import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../services/voice.service';
import { DataService, Object as DataObject  } from '../../services/data.service'; // Import the objects }

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // List of all alphabet letters
  searchLetter = ''; // Holds the current search query for letters
  selectedLetter = ''; // Stores the last selected letter
  filteredAlphabet: string[] = []; // Array to hold filtered alphabet letters
  mode = 'all'; // Mode toggle (all, alphabet, phonics, objects)
  searchLetterIcon = '';
  isReading = false; // Flag to indicate if the read all process is ongoing
  isAutoRead = false; // Flag to indicate if auto read is enabled

  objects: DataObject[]=[]; // Assigning the imported objects array

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
    ) {}

    ngOnInit() {
      this.filteredAlphabet = this.alphabet.split('');
      this.dataService.getObjects().subscribe(objects => {
        this.objects = objects;
      });
    }

  playPhoneticSpeech(letter: string): void {
    const language: 'English' = 'English'; // Use English phonics only
    if (this.mode === 'all' || this.mode === 'alphabet') {
      this.playAlphabetSound(letter, language);
    }
    if (this.mode === 'all' || this.mode === 'phonics') {
      this.playPhoneticSound(letter, language);
    }
    if (this.mode === 'all' || this.mode === 'objects') {
      const object = this.objects.find(obj => obj.letter === letter);
      if (object) {
        this.voiceService.playText(object.object, language); // Use the correct service method
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

  playAlphabetSound(letter: string, language: 'English'): void {
    this.voiceService.playText(letter, language); // Use the correct service method
  }

  playPhoneticSound(letter: string, language: 'English'): void {
    const phonetic = this.voiceService.getPhonetic(letter);
    this.voiceService.playText(phonetic, language); // Use the correct service method
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
    let intervalTime: number;

    switch (this.mode) {
      case 'alphabet':
        intervalTime = 2200;
        break;
      case 'phonics':
        intervalTime = 2200;
        break;
      default:
        intervalTime = 5000;
    }

    const intervalId = setInterval(() => {
      if (index < this.filteredAlphabet.length && this.isReading) {
        const letter = this.filteredAlphabet[index];
        this.playPhoneticSpeech(letter); // Play phonetic sound and update searchLetter
        index++;
      } else {
        clearInterval(intervalId); // Stop the interval when all items are read
        this.stopReading();
      }
    }, intervalTime); // Use the interval time based on the mode
  }

  stopReading(): void {
    this.isReading = false; // Set isReading flag to false
    console.log('Stopped reading.');
  }
}
