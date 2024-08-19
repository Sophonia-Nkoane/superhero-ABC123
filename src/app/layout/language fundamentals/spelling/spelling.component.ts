import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';
import { DataManagerComponent } from '../../../data-manager/data-manager.component';

// Define the SpellingComponent with metadata
@Component({
  selector: 'app-spelling',
  standalone: true,
  imports: [CommonModule, FormsModule, DataManagerComponent],
  templateUrl: './spelling.component.html',
  styleUrls: ['./spelling.component.css']
})
export class SpellingComponent implements OnInit {
  // Array of words used for spelling practice
  words: string[] = [];
  // The current search word
  searchWord = '';
  // The currently selected word
  selectedWord = '';
  // Filtered list of words
  filteredWords: string[] = [];
  // Count of attempts made by the user
  attemptCount: number = 0;
  // Current level of the spelling practice
  level: number = 1;
  // Map to store missing letters and their indexes for each word
  missingLettersMap: Map<string, { letters: string[], indexes: number[] }> = new Map();
  // Map to store user inputs for each word
  userInputs: Map<string, Set<string>> = new Map();
  // Index of the expected letter to be input by the user
  expectedLetterIndex: number = 0;
  // Map to store the current input index for each word
  currentInputIndex: Map<string, number> = new Map();

  // Observable for section1 array from the data service
  section1Array$: Observable<string[]>;

  // Flag to toggle phonetic mode
  usePhonetics: boolean = false;

  // Query list of input elements for user inputs
  @ViewChildren('userInput') inputElements: QueryList<ElementRef<HTMLInputElement>> | null = null;

  // Constructor to inject required services
  constructor(private voiceService: VoiceService, private dataService: DataService) {
    this.section1Array$ = this.dataService.getSection1Array();
  }

  // OnInit lifecycle hook to initialize data
  ngOnInit() {
    this.dataService.getWords().subscribe(wordsObj => {
      this.words = wordsObj['words'];
      this.filteredWords = this.words;
    });

    this.section1Array$.subscribe(words => {
      words.forEach(word => this.currentInputIndex.set(word, 0));
    });
  }

// Play audio for the given word
async playWordAudio(word: string): Promise<void> {
  // Play full word normally
  await this.playText(word);

  // Wait for the full word to finish playing
  await this.delay(1000);

  if (this.usePhonetics) {
    // Play each letter phonetically with spacing
    const letters = word.split('');
    await this.playLettersPhonetically(letters);
  } else {
    // Play each letter normally with spacing
    await this.playLettersNormally(word);
  }

  // Play full word again
  await this.delay(1000);
  await this.playText(word);
}

// Play letters phonetically with a delay
private async playLettersPhonetically(letters: string[]): Promise<void> {
  for (const letter of letters) {
    await this.playPhoneticSound(letter);
    await this.delay(1000); // 1 second pause between letters
  }
}

// Play letters normally with a delay
private async playLettersNormally(word: string): Promise<void> {
  const letters = word.split('');
  for (const letter of letters) {
    await this.playText(letter);
    await this.delay(1000); // 1 second between each letter
  }
}

// Play the phonetic sound for a given letter
private async playPhoneticSound(letter: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const audioPath = `assets/phonics/lowerCase/${letter}.mp3`;
    const audio = new Audio(audioPath);
    audio.onended = () => resolve();
    audio.onerror = () => {
      console.error(`Error playing audio for letter: ${letter}`);
      resolve();
    };
    audio.play().catch((error) => {
      console.error(`Error playing audio: ${error}`);
      resolve();
    });
  });
}

// Play text using VoiceService
private async playText(text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    this.voiceService.playText(text, 'English');
    // Assuming playText is synchronous, we'll add a small delay before resolving
    setTimeout(resolve, 500 + text.length * 100); // Adjust timing based on text length
  });
}

// Helper method to create a delay
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  // Toggle the use of phonetics
  togglePhonetics(): void {
    this.usePhonetics = !this.usePhonetics;
  }

  // Provide a hint for the given word
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

  // Check the user's answer for the given word
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

  // Check if all letters for the word are entered correctly
  allLettersEntered(word: string): boolean {
    const missingLetterData = this.missingLettersMap.get(word);
    if (missingLetterData) {
      const { letters } = missingLetterData;
      const userInput = this.userInputs.get(word) || new Set();
      return letters.every(letter => userInput.has(letter.toLowerCase()));
    }
    return false;
  }

  // Focus the next input element
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

  // Get the word blocks with missing letters based on the level
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

  // Set the missing letters for the word based on the level
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

  // Get two random indexes for level 2
  getTwoRandomIndexes(length: number): number[] {
    const index1 = Math.floor(Math.random() * length);
    let index2 = Math.floor(Math.random() * length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * length);
    }
    return [index1, index2];
  }

  // Set the new level and reset the component state
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
