import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService, Object as DataObject } from '../../../services/data.service';
import { Router } from '@angular/router';

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
    private dataService: DataService,
    private router: Router
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
  async playPhoneticSpeech(letter: string): Promise<void> {
    if (this.isReading) return; // Prevent multiple clicks while already reading

    this.isReading = true; // Disable buttons and routing
    this.router.navigate = () => Promise.resolve(false); // Disable navigation

    const language: 'English' = 'English';

    if (this.mode === 'all') {
      this.updateVisualForAll(letter);
      await this.playAlphabetSound(letter, language);
      await this.delay(1000);
      await this.playPhoneticSound(letter, language);
      await this.delay(1000);

      const object = this.objects.find(obj => obj.letter === letter);
      if (object) {
        await this.playObjectSound(object.object, language);
      }
    } else {
      if (this.mode === 'alphabet' || this.mode === 'all') {
        await this.playAlphabetSound(letter, language);
      }
      if (this.mode === 'phonics' || this.mode === 'all') {
        await this.playPhoneticSound(letter, language);
      }
      if (this.mode === 'objects' || this.mode === 'all') {
        const object = this.objects.find(obj => obj.letter === letter);
        if (object) {
          await this.playObjectSound(object.object, language);
          if (this.mode === 'all') {
            this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()} - ${object.object} ${object.icon}`;
          } else {
            this.searchLetter = `${object.object} ${object.icon}`;
          }
        }
      }
    }

    this.selectedLetter = letter;
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.updateSearchLetter(letter);
    }

    this.isReading = false; // Re-enable buttons and routing

    // Re-enable routing by reassigning the original method
    this.router.navigate = Router.prototype.navigate;
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
  async playAlphabetSound(letter: string, language: 'English'): Promise<void> {
    return new Promise<void>((resolve) => {
      this.voiceService.playText(letter, language);
      // Assuming playText is synchronous, we'll add a small delay before resolving
      setTimeout(resolve, 500);
    });
  }

  // Play the phonetic sound for the given letter
  async playPhoneticSound(letter: string, language: 'English'): Promise<void> {
    return new Promise<void>((resolve) => {
      const audioPath = `assets/phonics/upperCase/${letter}.mp3`;
      const audio = new Audio(audioPath);
      audio.onended = () => {
        resolve();
      };
      audio.play();
    });
  }

  // Play the object sound for the given object
  async playObjectSound(object: string, language: 'English'): Promise<void> {
    return new Promise<void>((resolve) => {
      this.voiceService.playText(object, language);
      // Assuming playText is synchronous, we'll add a small delay before resolving
      setTimeout(resolve, 1000);
    });
  }

  // Helper method to create a delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  async readAll(): Promise<void> {
    this.isReading = true;
    for (const letter of this.filteredAlphabet) {
      if (!this.isReading) break;
      await this.playPhoneticSpeech(letter);
      await this.delay(1000); // Add a delay between letters
    }
    this.stopReading();
  }

  // Stop the reading process
  stopReading(): void {
    this.isReading = false;
  }
}
