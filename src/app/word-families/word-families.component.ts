import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VoiceService } from '../voice.service';

// Define interface for word families
interface WordFamily {
  group: 'Vowels' | 'Consonants'; // Define group type for word families
  prefix: string; // Prefix for word family
  words: string[]; // Array of words in the word family
}

// Array of predefined word families
const WORD_FAMILIES: WordFamily[] = [
  { group: 'Vowels', prefix: 'at', words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat'] },// Vowel word family
  { group: 'Vowels', prefix: 'an', words: ['can', 'fan', 'man', 'van', 'tan', 'pan', 'scan', 'plan'] },// Vowel word family
  { group: 'Consonants', prefix: 'in', words: ['pin', 'tin', 'win', 'din', 'kin', 'lin', 'min', 'sin'] },// Consonant word family
  { group: 'Consonants', prefix: 'en', words: ['pen', 'ten', 'hen', 'men', 'den', 'len', 'wen', 'gen'] },// Consonant word family
  { group: 'Vowels', prefix: 'ot', words: ['not', 'hot', 'pot', 'rot', 'tot', 'dot', 'got', 'lot'] },
  { group: 'Vowels', prefix: 'un', words: ['fun', 'run', 'sun', 'bun', 'gun', 'hun', 'mun', 'pun'] },
  { group: 'Consonants', prefix: 'et', words: ['get', 'set', 'vet', 'bet', 'jet', 'let', 'met', 'net'] },
  { group: 'Consonants', prefix: 'it', words: ['sit', 'kit', 'lit', 'mit', 'nit', 'pit', 'rit', 'wit'] },
  { group: 'Consonants', prefix: 'ut', words: ['cut', 'gut', 'hut', 'lut', 'mut', 'nut', 'put', 'rut'] },
  { group: 'Vowels', prefix: 'am', words: ['cam', 'ham', 'jam', 'lam', 'mam', 'ram', 'sam', 'dam'] },
  { group: 'Vowels', prefix: 'em', words: ['gem', 'hem', 'lem', 'mem', 'nem', 'rem', 'sem', 'them'] },
  { group: 'Consonants', prefix: 'im', words: ['him', 'lim', 'rim', 'sim', 'tim', 'vim', 'whim', 'brim'] }
];

@Component({
  selector: 'app-word-families',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-families.component.html',
  styleUrl: './word-families.component.css'
})
export class WordFamiliesComponent {
  // Array to hold predefined word families
  wordFamilies: WordFamily[] = WORD_FAMILIES;
  // Array of alphabet letters
  alphabet: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
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
    const vowels: string[] = ['a', 'e', 'i', 'o', 'u'];
    const currentGroup: 'Vowels' | 'Consonants' = this.selectedWordFamily.group;

    // Filter alphabet based on current word family group (vowels or consonants)
    const groupLetters: string[] = this.alphabet.filter(letter =>
      currentGroup === 'Vowels' ? vowels.includes(letter) : !vowels.includes(letter)
    );

    // If no letters left in the filtered group, choose a random letter from entire alphabet
    if (groupLetters.length === 0) {
      return this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
    }

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

      // Play the entire word family
      if (this.isCorrect) {
        this.voiceService.playWords(this.selectedWordFamily.words);
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
}
