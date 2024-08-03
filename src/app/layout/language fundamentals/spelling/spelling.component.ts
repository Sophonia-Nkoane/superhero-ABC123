import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';
import { DataManagerComponent } from '../../../data-manager/data-manager.component';

@Component({
  selector: 'app-spelling',
  standalone: true,
  imports: [CommonModule, FormsModule,DataManagerComponent],
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
  userInputs: Map<string, Set<string>> = new Map();
  expectedLetterIndex: number = 0;
  currentInputIndex: Map<string, number> = new Map();

  section1Array$: Observable<string[]>;

  usePhonetics: boolean = false;

  @ViewChildren('userInput') inputElements: QueryList<ElementRef<HTMLInputElement>> | null = null;

  constructor(private voiceService: VoiceService, private dataService: DataService) {
    this.section1Array$ = this.dataService.getSection1Array();
  }

  ngOnInit() {
    this.dataService.getWords().subscribe(wordsObj => {
      this.words = wordsObj['words'];
      this.filteredWords = this.words;
    });

    this.section1Array$.subscribe(words => {
      words.forEach(word => this.currentInputIndex.set(word, 0));
    });
  }
  playWordAudio(word: string): void {
    // Play full word normally
    this.voiceService.playText(word, 'English');

    // Wait for the full word to finish playing
    setTimeout(() => {
      if (this.usePhonetics) {
        // Play each letter phonetically with spacing
        const letters = word.split('');
        this.playLettersPhonetically(letters, 0);
      } else {
        // Play each letter normally with spacing
        this.playLettersNormally(word);
      }
    }, 1000 + word.length * 150); // Adjust timing based on word length
  }

  private playLettersPhonetically(letters: string[], index: number): void {
    if (index >= letters.length) {
      // All letters have been played, play the full word again
      setTimeout(() => {
        this.voiceService.playText(letters.join(''), 'English');
      }, 1000);
      return;
    }

    const letter = letters[index];

    // Play the phonetic sound of the letter
    this.playPhoneticSound(letter);

    // Wait for the phonetic sound to finish, then move to the next letter
    setTimeout(() => {
      this.playLettersPhonetically(letters, index + 1);
    }, 1000); // 1 second pause between letters
  }

  private playLettersNormally(word: string): void {
    const letters = word.split('');
    for (let i = 0; i < letters.length; i++) {
      setTimeout(() => {
        this.voiceService.playText(letters[i], 'English');
      }, i * 1000); // 1 second between each letter
    }

    // Play full word again
    setTimeout(() => {
      this.voiceService.playText(word, 'English');
    }, letters.length * 1000 + 1000); // Wait for all letters to be spoken, then add 1 more second
  }

  private playPhoneticSound(letter: string): void {
    const audioPath = `assets/phonics/lowerCase/${letter}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch((error) => {
      console.error(`Error playing audio: ${error}`);
    });
  }

  togglePhonetics(): void {
    this.usePhonetics = !this.usePhonetics;
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
    event.preventDefault();

    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value.toLowerCase();
    const missingLetterData = this.missingLettersMap.get(word);

    if (missingLetterData) {
      const { letters, indexes } = missingLetterData;
      let userInput = this.userInputs.get(word) || new Set();
      const currentIndex = this.currentInputIndex.get(word) || 0;

      if (input === letters[currentIndex].toLowerCase()) {
        // Correct input
        userInput.add(input);
        this.userInputs.set(word, userInput);
        inputElement.style.border = '1px solid green';
        inputElement.disabled = true;

        this.currentInputIndex.set(word, currentIndex + 1);

        if (this.level === 2 || this.level === 3) {
          if (this.allLettersEntered(word)) {
            this.playWordAudio(word);
          } else {
            this.focusNextInput(inputElement);
          }
        } else if (this.level === 1) {
          this.playWordAudio(word);
        }
      } else {
        // Incorrect input
        this.attemptCount++;
        inputElement.value = '';
        inputElement.style.border = '1px solid red';
        alert('Incorrect. Try again!');
      }
    }
  }

  allLettersEntered(word: string): boolean {
    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { letters } = missingLetterData;
      const userInput = this.userInputs.get(word) || new Set();
      return letters.every(letter => userInput.has(letter.toLowerCase()));
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
        if (!nextInput.disabled) {
          nextInput.focus();
        } else {
          this.focusNextInput(nextInput); // Recursively call to find next enabled input
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
    this.missingLettersMap.clear();
    this.userInputs.clear();

    this.selectedWord = '';
    this.filteredWords = this.words;

    if (this.inputElements) {
      this.inputElements.forEach(input => {
        const nativeInput = input.nativeElement as HTMLInputElement;
        nativeInput.value = '';
        nativeInput.style.border = '1px solid #ccc';
        nativeInput.disabled = false;
      });
    }

    this.section1Array$.subscribe(words => {
      words.forEach(word => this.currentInputIndex.set(word, 0));
    });
  }
}

