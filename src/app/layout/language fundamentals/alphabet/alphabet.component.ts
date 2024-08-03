import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService, Object as DataObject  } from '../../../services/data.service';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  searchLetter = '';
  selectedLetter = '';
  filteredAlphabet: string[] = [];
  mode = 'all';
  searchLetterIcon = '';
  isReading = false;
  isAutoRead = false;

  objects: DataObject[] = [];

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
    const language: 'English' = 'English';

    if (this.mode === 'all') {
      // Play alphabet sound
      this.playAlphabetSound(letter, language);

      // Wait for 1 second before playing phonetic sound
      setTimeout(() => {
        this.playPhoneticSound(letter, language);

        // Wait for 1 second before playing object sound
        setTimeout(() => {
          const object = this.objects.find(obj => obj.letter === letter);
          if (object) {
            this.voiceService.playText(object.object, language);
            this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()} - ${object.object} ${object.icon}`;
          }
        }, 1000);
      }, 1000);
    } else {
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
  }

  playAlphabetSound(letter: string, language: 'English'): void {
    this.voiceService.playText(letter, language);
  }

  playPhoneticSound(letter: string, language: 'English'): void {
    const audioPath = `assets/phonics/upperCase/${letter}.mp3`;
    const audio = new Audio(audioPath);
    audio.play();
  }

  updateSearchLetter(letter: string): void {
    if (this.mode !== 'objects' && this.mode !== 'all') {
      this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
    }
  }

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

  filterAlphabet(): void {
    this.filteredAlphabet = this.alphabet.split('').filter(letter =>
      letter.includes(this.searchLetter.toUpperCase())
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
    this.searchLetter = '';
  }

  toggleAutoRead(): void {
    this.isAutoRead = !this.isAutoRead;
    if (this.isAutoRead) {
      this.readAll();
    } else {
      this.stopReading();
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
        this.playPhoneticSpeech(letter);
        index++;
      } else {
        clearInterval(intervalId);
        this.stopReading();
      }
    }, intervalTime);
  }

  stopReading(): void {
    this.isReading = false;
    console.log('Stopped reading.');
  }
}
