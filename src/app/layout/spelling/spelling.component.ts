import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../services/voice.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spelling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spelling.component.html',
  styleUrls: ['./spelling.component.css']
})
export class SpellingComponent implements OnInit {
  words: string[] = [];
  searchWord = '';
  selectedWord = '';
  filteredWords: string[] = [];
  attemptCount: number = 0;
  level: number = 1;
  missingLettersMap: Map<string, { letters: string[], indexes: number[] }> = new Map(); // Updated to handle multiple letters
  userInputs: Map<string, Set<string>> = new Map(); // Map to track user inputs
  expectedLetterIndex: number = 0;

  // Array for section 1
  section1Array$: Observable<string[]>;

  @ViewChildren('userInput') inputElements: QueryList<ElementRef<HTMLInputElement>> | null = null;

  constructor(private voiceService: VoiceService, private dataService: DataService) {
    this.section1Array$ = this.dataService.getSection1Array();
  }

  ngOnInit() {
    this.dataService.getWords().subscribe(wordsObj => {
      this.words = wordsObj['words'];
      this.filteredWords = this.words;
    });
  }

  playWordAudio(word: string): void {
    const language: 'English' = 'English';

    // Play full word
    this.voiceService.playText(word, language);

    // Play each letter with spacing and full stop
    const letters = word.split('');
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      this.voiceService.playText(letter, language);
      if (i < letters.length - 1) {
        this.voiceService.playText('  ', language);
      }
    }

    // Play full word again
    setTimeout(() => {
      this.voiceService.playText(word, language);
    }, 2000);
  }

  hint(word: string): void {
    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { letters } = missingLetterData;
      const userInput = this.userInputs.get(word) || new Set();
      const missingLetters = letters.filter(letter => !userInput.has(letter));
      if (missingLetters.length === 0) {
        alert('All letters are correctly entered!');
      } else {
        alert('Incorrect. The correct letters are ' + missingLetters.join(', '));
      }
    }
  }

  checkAnswer(event: Event, word: string): void {
    event.preventDefault(); // Prevent default behavior

    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;
    const missingLetterData = this.missingLettersMap.get(word);

    if (missingLetterData) {
      const { letters, indexes } = missingLetterData;
      const userInput = this.userInputs.get(word) || new Set();

      if (letters.includes(input)) {
        // Correct input
        userInput.add(input);
        this.userInputs.set(word, userInput);
        inputElement.style.border = '1px solid green'; // Highlight input field
        inputElement.disabled = true; // Disable input field

        // Move to the next input field if necessary
        if (this.level === 2 || this.level === 3) {
          if (this.allLettersEntered(word)) {
            this.playWordAudio(word);
          } else {
            this.focusNextInput(inputElement);
          }
        } else if (this.level === 1) {
          this.playWordAudio(word); // Play sound after just one correct letter
        }
      } else {
        // Incorrect input
        this.attemptCount++;
        inputElement.value = ''; // Clear incorrect input
        inputElement.style.border = '1px solid red'; // Highlight input field in red
        alert('Incorrect. Try again!'); // Show popup for incorrect input
      }
    }
  }

  allLettersEntered(word: string): boolean {
    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { letters } = missingLetterData;
      const userInput = this.userInputs.get(word) || new Set();
      return letters.every(letter => userInput.has(letter));
    }
    return false;
  }

  focusNextInput(currentInput: HTMLInputElement): void {
    if (this.inputElements) {
      const inputArray = this.inputElements.toArray();
      const currentIndex = inputArray.findIndex(input => input.nativeElement === currentInput);
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputArray.length) {
        const nextInput = inputArray[nextIndex].nativeElement as HTMLInputElement;
        nextInput.focus();
      }
    }
  }

  getWordBlocks(word: string): string[] {
    const letters = word.split('');
    if (!this.missingLettersMap.has(word)) {
      this.setMissingLetterForWord(word, letters);
    }

    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { letters: missingLetters, indexes } = missingLetterData;
      if (this.level === 1) {
        return letters.map((char, i) => i === indexes[0] ? '' : char);
      } else if (this.level === 2) {
        return letters.map((char, i) => indexes.includes(i) ? '' : char);
      } else if (this.level === 3) {
        return new Array(letters.length).fill('');
      }
    }
    return letters;
  }

  setMissingLetterForWord(word: string, letters: string[]): void {
    if (this.level === 1) {
      const missingIndex = Math.floor(Math.random() * letters.length);
      this.missingLettersMap.set(word, {
        letters: [letters[missingIndex]],
        indexes: [missingIndex]
      });
    } else if (this.level === 2) {
      const missingIndexes = this.getTwoRandomIndexes(letters.length);
      const missingLetters = missingIndexes.map(index => letters[index]);
      this.missingLettersMap.set(word, {
        letters: missingLetters,
        indexes: missingIndexes
      });
    } else if (this.level === 3) {
      // All letters are missing in level 3
      this.missingLettersMap.set(word, {
        letters: letters,
        indexes: letters.map((_, index) => index)
      });
    }
  }

  getTwoRandomIndexes(length: number): number[] {
    const index1 = Math.floor(Math.random() * length);
    let index2 = Math.floor(Math.random() * length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * length);
    }
    return [index1, index2];
  }

  setLevel(newLevel: number): void {
    this.level = newLevel;
    this.expectedLetterIndex = 0;
    this.attemptCount = 0;
    this.missingLettersMap.clear(); // Clear missing letters map when level changes
    this.userInputs.clear(); // Clear user inputs map when level changes

    // Reset selected word and filtered words
    this.selectedWord = '';
    this.filteredWords = this.words;

    // Reset input fields
    if (this.inputElements) {
      this.inputElements.forEach(input => {
        const nativeInput = input.nativeElement as HTMLInputElement;
        nativeInput.value = '';
        nativeInput.style.border = '1px solid #ccc'; // Reset border style
        nativeInput.disabled = false; // Ensure input is enabled
      });
    }
  }
}
