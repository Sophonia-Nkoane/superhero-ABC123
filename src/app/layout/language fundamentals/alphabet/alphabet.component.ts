import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService, Object as DataObject } from '../../../services/data.service';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit {
  // The complete alphabet
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // The letter being searched for
  searchLetter = '';
  // The currently selected letter
  selectedLetter = '';
  // Filtered list of letters
  filteredAlphabet: string[] = [];
  // The mode of the component, default is 'all'
  mode = 'all';
  // Icon for the search letter
  searchLetterIcon = '';
  // Whether the component is in reading mode
  isReading = false;
  // Whether auto-read is enabled
  isAutoRead = false;

  // List of data objects
  objects: DataObject[] = [];

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // Initialize filteredAlphabet with the full alphabet
    this.filteredAlphabet = this.alphabet.split('');
    // Subscribe to get objects from data service
    this.dataService.getObjects().subscribe(objects => {
      this.objects = objects;
    });
  }

  // Play phonetic speech for the given letter
  playPhoneticSpeech(letter: string): void {
    const language: 'English' = 'English';

    if (this.mode === 'all') {
      // Update visual immediately
      this.updateVisualForAll(letter);

      // Play alphabet sound
      this.playAlphabetSound(letter, language);

      // Play phonetic sound after a delay
      setTimeout(() => {
        this.playPhoneticSound(letter, language);

        // Play object sound after another delay
        setTimeout(() => {
          const object = this.objects.find(obj => obj.letter === letter);
          if (object) {
            this.voiceService.playText(object.object, language);
          }
        }, 1000);
      }, 1000);
    } else {
      // Play sounds based on the current mode
      if (this.mode === 'alphabet' || this.mode === 'all') {
        this.playAlphabetSound(letter, language);
      }
      if (this.mode === 'phonics' || this.mode === 'all') {
        this.playPhoneticSound(letter, language);
      }
      if (this.mode === 'objects' || this.mode === 'all') {
        const object = this.objects.find(obj => obj.letter === letter);
        if (object) {
          this.voiceService.playText(object.object, language);
          // Update search letter based on the mode
          if (this.mode === 'all') {
            this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()} - ${object.object} ${object.icon}`;
          } else {
            this.searchLetter = `${object.object} ${object.icon}`;
          }
        }
      }
    }

    // Update the selected letter and search letter
    this.selectedLetter = letter;
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.updateSearchLetter(letter);
    }
  }

  // Update the visual display for all modes
  updateVisualForAll(letter: string): void {
    const object = this.objects.find(obj => obj.letter === letter);
    if (object) {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()} - ${object.object} ${object.icon}`;
    } else {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
    }
  }

  // Play the alphabet sound for the given letter
  playAlphabetSound(letter: string, language: 'English'): void {
    this.voiceService.playText(letter, language);
  }

  // Play the phonetic sound for the given letter
  playPhoneticSound(letter: string, language: 'English'): void {
    const audioPath = `assets/phonics/upperCase/${letter}.mp3`;
    const audio = new Audio(audioPath);
    audio.play();
  }

  // Update the search letter display
  updateSearchLetter(letter: string): void {
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
    }
  }

  // Handle key press events
  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase();
    if (this.alphabet.includes(letter)) {
      this.searchLetter = letter;
      if (this.mode === 'all' && this.isAutoRead) {
        this.readAll();
      } else {
        this.playPhoneticSpeech(letter);
      }
    }
  }

  // Filter the alphabet based on the search letter
  filterAlphabet(): void {
    this.filteredAlphabet = this.alphabet.split('').filter(letter =>
      letter.includes(this.searchLetter.toUpperCase())
    );
  }

  // Get the object associated with the given letter
  getObject(letter: string): string {
    const object = this.objects.find(obj => obj.letter === letter);
    return object ? object.object : '';
  }

  // Get the icon associated with the given letter
  getObjectIcon(letter: string): string {
    const object = this.objects.find(obj => obj.letter === letter);
    return object ? object.icon : '';
  }

  // Toggle the mode of the component
  toggleMode(mode: string): void {
    this.mode = mode;
    this.searchLetter = '';
  }

  // Toggle auto-read functionality
  toggleAutoRead(): void {
    this.isAutoRead = !this.isAutoRead;
    if (this.isAutoRead) {
      this.readAll();
    } else {
      this.stopReading();
    }
  }

  // Read all letters based on the current mode
  readAll(): void {
    this.isReading = true;
    let index = 0;
    let intervalTime: number;

    // Set interval time based on the mode
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
        this.playPhoneticSpeech(letter);
        index++;
      } else {
        clearInterval(intervalId);
        this.stopReading();
      }
    }, intervalTime);
  }

  // Stop the reading process
  stopReading(): void {
    this.isReading = false;
  }
}
