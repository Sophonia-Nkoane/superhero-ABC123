import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../Utilities/voice.service';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class learningComponent implements OnInit {
  alphabet: string = '';
  searchLetter = '';
  selectedLetter = '';
  filteredAlphabet: string[] = [];
  searchLetterIcon = '';

  // Arrays for sections
  section1Array$: Observable<string[]>;
  section2Array$: Observable<string[]>;
  section3Array$: Observable<string[]>;

  // Table for section 3
  section3Table: string[][] = [];

  constructor(private voiceService: VoiceService, private dataService: DataService) {
    this.section1Array$ = this.dataService.getSection1Array();
    this.section2Array$ = this.dataService.getSection2Array();
    this.section3Array$ = this.dataService.getSection3Array();
  }

  ngOnInit() {
    this.alphabet = this.dataService.getAlphabet().join('');
    this.filteredAlphabet = this.alphabet.split('');
    this.populateSection3Table();
  }

  playSpeech(text: string): void {
    const language: 'English' = 'English';
    this.voiceService.playText(text, language);

    this.searchLetter = `${text.toUpperCase()} ${text.toLowerCase()}`;
    this.selectedLetter = text;
  }

  playSpeechWithPhonetics(word: string): void {
    const language: 'English' = 'English';

    // Read individual letters of the word using phonetics
    for (const letter of word.split('')) {
      this.playPhoneticSound(letter, language);
    }

    // Then read the full word after a short delay
    setTimeout(() => {
      this.voiceService.playText(word, language);
    }, 1500);

    this.searchLetter = `${word.toUpperCase()} ${word.toLowerCase()}`;
    this.selectedLetter = word;
  }

  playPhoneticSound(letter: string, language: 'English'): void {
    const phonetic = this.voiceService.getPhonetic(letter);
    this.voiceService.playText(phonetic, language);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase();
    if (this.alphabet.includes(letter)) {
      this.searchLetter = letter;
      this.playSpeech(letter);
    }
  }

  filterAlphabet(): void {
    this.filteredAlphabet = this.alphabet.split('').filter(letter =>
      letter.includes(this.searchLetter.toUpperCase())
    );
  }

  populateSection3Table(): void {
    this.section3Array$.subscribe(section3Array => {
      const rows = 4;
      const columns = 4;
      let index = 0;
      this.section3Table = [];
      for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < columns; j++) {
          if (index < section3Array.length) {
            row.push(section3Array[index]);
            index++;
          } else {
            row.push('');
          }
        }
        this.section3Table.push(row);
      }
    });
  }
}
