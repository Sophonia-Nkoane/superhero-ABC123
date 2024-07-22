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
  missingLettersMap: Map<string, { letters: string[], indexes: number[] }> = new Map();
  userInputs: Map<string, Map<number, string>> = new Map();
  expectedLetterIndex: number = 0;
  modifiedWords: Map<string, string> = new Map();

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
      this.words.forEach(word => {
        this.setMissingLetterForWord(word, word.split(''));
      });
    });
  }

  playWordAudio(word: string): void {
    const language: 'English' = 'English';

    // Play full word
    this.voiceService.playText(word, language);

    // Play each letter with spacing
    const letters = word.split('');
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      this.voiceService.playText(letter, language);
      if (i < letters.length - 1) {
        // Add a pause between letters (e.g., 500ms)
        setTimeout(() => {}, 500);
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
      const userInput = this.userInputs.get(word) || new Map<number, string>();
      const missingLetters = letters.filter((_, index) => !userInput.has(index));
      if (missingLetters.length === 0) {
        alert('All letters are correctly entered!');
      } else {
        alert('Incorrect. The correct letters are ' + missingLetters.join(', '));
      }
    }
  }

  updateUserInput(value: string, word: string, index: number): void {
    if (!this.userInputs.has(word)) {
      this.userInputs.set(word, new Map<number, string>());
    }
    const wordInputs = this.userInputs.get(word)!;
    wordInputs.set(index, value);

    if (this.level > 1) {
      this.checkLetterOrder(word, index);
    }

    if (this.allLettersEntered(word)) {
      this.checkAnswer(word);
    }
  }

  checkLetterOrder(word: string, currentIndex: number): void {
    const wordInputs = this.userInputs.get(word)!;
    const enteredLetter = wordInputs.get(currentIndex);

    if (enteredLetter !== word[currentIndex]) {
      alert(`Incorrect letter order. The correct letter at this position is '${word[currentIndex]}'.`);
      wordInputs.set(currentIndex, '');

      // Focus back on the current input
      if (this.inputElements) {
        const inputArray = this.inputElements.toArray();
        const currentInput = inputArray[currentIndex]?.nativeElement as HTMLInputElement;
        if (currentInput) {
          currentInput.focus();
        }
      }
    } else {
      // If correct, move to the next input
      const nextInput = this.inputElements?.toArray()[currentIndex + 1]?.nativeElement;
      if (nextInput) {
        this.focusNextInput(nextInput);
      }
    }
  }

  checkAnswer(word: string): void {
    const wordInputs = this.userInputs.get(word);
    if (!wordInputs) return;

    const correctOrder = Array.from(wordInputs.values()).join('') === word;

    if (correctOrder) {
      const missingLetterData = this.missingLettersMap.get(word);
      if (missingLetterData) {
        const { indexes } = missingLetterData;

        for (let i = 0; i < word.length; i++) {
          if (indexes.includes(i)) {
            // Check only missing letter positions
            if (wordInputs.get(i) !== word[i]) {
              this.attemptCount++;
              this.userInputs.get(word)!.forEach((_, i) => {
                this.userInputs.get(word)!.set(i, '');
              });
              alert(`Incorrect. The correct order is: ${word}. Try again!`);
              return;
            }
          } else {
            // Ensure non-missing positions are unchanged
            if (wordInputs.has(i) && wordInputs.get(i) !== word[i]) {
              this.attemptCount++;
              this.userInputs.get(word)!.forEach((_, i) => {
                this.userInputs.get(word)!.set(i, '');
              });
              alert(`Incorrect. The correct order is: ${word}. Try again!`);
              return;
            }
          }
        }
      }
      // Correct input
      this.playWordAudio(word);
    } else {
      // Incorrect input
      this.attemptCount++;
      this.userInputs.get(word)!.forEach((_, i) => {
        this.userInputs.get(word)!.set(i, '');
      });
      alert(`Incorrect. The correct order is: ${word}. Try again!`);
    }
  }

  allLettersEntered(word: string): boolean {
    const wordInputs = this.userInputs.get(word);
    if (!wordInputs) return false;

    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { indexes } = missingLetterData;
      return indexes.every(index => wordInputs.get(index) === word[index]);
    }
    return false;
  }

  getCurrentInputIndex(inputElement: HTMLInputElement): number {
    if (this.inputElements) {
      return this.inputElements.toArray().findIndex(el => el.nativeElement === inputElement);
    }
    return -1;
  }

  focusNextInput(currentInput: HTMLInputElement): void {
    if (this.inputElements) {
      const inputArray = this.inputElements.toArray();
      const currentIndex = inputArray.findIndex(input => input.nativeElement === currentInput);
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputArray.length) {
        const nextInput = inputArray[nextIndex].nativeElement as HTMLInputElement;
        if (nextInput.value === '') {
          nextInput.focus();
        }
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
        return letters.map((char, i) => i === indexes[0] ? '_' : char);
      } else if (this.level === 2) {
        return letters.map((char, i) => indexes.includes(i) ? '_' : char);
      } else if (this.level === 3) {
        return new Array(letters.length).fill('_');
      }
    }
    return letters;
  }

  setMissingLetterForWord(word: string, letters: string[]): void {
    if (this.level === 1) {
      const missingIndex = Math.floor(Math.random() * letters.length);
      const modifiedWord = word.split('');
      modifiedWord[missingIndex] = '_';
      this.modifiedWords.set(word, modifiedWord.join(''));
    } else if (this.level === 2) {
      const missingIndexes = this.getTwoRandomIndexes(letters.length);
      const modifiedWord = word.split('');
      missingIndexes.forEach(index => modifiedWord[index] = '_');
      this.modifiedWords.set(word, modifiedWord.join(''));
    } else if (this.level === 3) {
      // All letters are missing in level 3
      this.modifiedWords.set(word, '_'.repeat(word.length));
    }
  }

  getTwoRandomIndexes(length: number): number[] {
    const indexes: number[] = [];
    while (indexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  }

  setLevel(newLevel: number): void {
    this.level = newLevel;
    this.attemptCount = 0;
    this.userInputs.clear();
    this.missingLettersMap.clear();
  }
}
