import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceService } from '../../services/voice.service';
import { WORD_FAMILIES, WordFamily, alphabet, vowels } from '../../Utilities/word-management';

@Component({
  selector: 'app-word-families',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-families.component.html',
  styleUrls: ['./word-families.component.css']
})
export class WordFamiliesComponent {
  // Array to hold predefined word families
  wordFamilies: WordFamily[] = WORD_FAMILIES;

  // Array of alphabet letters
  alphabet: string[] = alphabet;

  // Selected word family for the current game
  selectedWordFamily: WordFamily = this.getRandomWordFamily();

  // Starting letter for the current game
  startingLetter: string = this.getRandomLetter();

  // Boolean to track if the current answer is correct
  isCorrect: boolean = false;

  // Boolean to track if the user has answered
  answered: boolean = false;

  constructor(private voiceService: VoiceService) { }

  // Method to generate a random letter from alphabet
  getRandomLetter(): string {
    const currentGroup: 'Vowels' | 'Consonants' = this.selectedWordFamily.group;

    // Filter alphabet based on current word family group (vowels or consonants)
    const groupLetters: string[] = this.alphabet.filter(letter =>
      currentGroup === 'Vowels' ? vowels.includes(letter) : !vowels.includes(letter)
    );

    // If no letters left in the filtered group, choose a random letter from entire alphabet
    if (groupLetters.length === 0) {
      return this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
    }

    // Choose a random letter from the filtered group
    const randomIndex: number = Math.floor(Math.random() * groupLetters.length);
    return groupLetters[randomIndex];
  }

  // Method to get a random word family from the predefined list
  getRandomWordFamily(): WordFamily {
    const randomIndex: number = Math.floor(Math.random() * this.wordFamilies.length);
    return this.wordFamilies[randomIndex];
  }

  // Method to handle completing a word with a given prefix
  completeWord(prefix: string): void {
    this.answered = true;

    // Find the selected word family based on the prefix
    const selectedWordFamily: WordFamily | undefined = this.wordFamilies.find(wf => wf.prefix === prefix);

    if (selectedWordFamily) {
      this.selectedWordFamily = selectedWordFamily;

      // Construct the complete word
      const completeWord: string = this.startingLetter + prefix;

      // Check if the complete word is in the selected word family
      this.isCorrect = selectedWordFamily.words.includes(completeWord);

      // Play the words and highlight/animate them one by one
      if (this.isCorrect) {
        const wordElements = this.selectedWordFamily.words.map(word => ({
          word,
          highlighted: false
        }));

        this.voiceService.playWords(
          this.selectedWordFamily.words,
          'English', // Adjust the language string as needed
          (word) => this.highlightWord(word, wordElements),
          (word) => this.unhighlightWord(word, wordElements)
        );
      }
    }
  }

  // Method to move to the next letter
  nextLetter(): void {
    // If the current answer is correct, confirm move to next letter
    if (this.isCorrect) {
      const confirmMoveOn: boolean = confirm('Correct! Move on to the next letter?');
      if (confirmMoveOn) {
        // Generate a new starting letter and word family for the next round
        this.startingLetter = this.getRandomLetter();
        this.selectedWordFamily = this.getRandomWordFamily();
        this.isCorrect = false;
        this.answered = false;
      }
    } else {
      // Alert user to complete the current word correctly before moving on
      alert('Please complete the current word correctly before moving on.');
    }
  }

  createWordElement(word: string): HTMLElement {
    const span = document.createElement('span');
    span.innerText = word;
    span.classList.add('word');
    return span;
  }

  highlightWord(word: string, wordElements: { word: string, highlighted: boolean }[]): void {
    const index = wordElements.findIndex(w => w.word === word);
    if (index !== -1) {
      wordElements[index].highlighted = true;
      // Use the word string instead of the element property
      console.log(word);
    }
  }

  unhighlightWord(word: string, wordElements: { word: string, highlighted: boolean }[]): void {
    const index = wordElements.findIndex(w => w.word === word);
    if (index !== -1) {
      wordElements[index].highlighted = false;
    }
  }
}
