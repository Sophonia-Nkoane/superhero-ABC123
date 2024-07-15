import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../Utilities/voice.service';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  searchLetter = '';
  selectedLetter = '';
  filteredAlphabet: string[] = [];
  searchLetterIcon = '';

  // Arrays for sections
  section1Array = ['map', 'frog','wet', 'hop', 'lad', 'lad','zoo', 'jug', 'box', 'kid', 'jump','vest', 'can', 'the', 'quiz', 'she', 'bin'];
  section2Array = ['She is at the zoo.', 'My frog can hop.', 'He is at the dam.','My dog can jump.'];
  section3Array = ['-og', '-in', '-op', '-at', 'jog', 'win', 'pop', 'mat', 'frog', 'bin', 'mop', 'cat', 'hop', 'fin', 'hop', 'pat'];

  // Table for section 3
  section3Table: string[][] = [];

  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
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
    const rows = 4;
    const columns = 4;
    let index = 0;
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        if (index < this.section3Array.length) {
          row.push(this.section3Array[index]);
          index++;
        } else {
          row.push('');
        }
      }
      this.section3Table.push(row);
    }
  }
}
