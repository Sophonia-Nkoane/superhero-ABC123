import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-sentence-building',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-building.component.html',
  styleUrl: './sentence-building.component.css'
})
export class SentenceBuildingComponent {
  // Object containing arrays of words categorized by type
  words = {
    beginningWords: [
      "The", "A", "An", "This", "That", "These", "Those", "Here", "There", "Now", "Then",
      "I", "You", "He", "She", "It", "We", "They", "My", "Your", "His", "Her"
    ],
    functionWords: [
      "a", "an", "my", "your", "his", "her", "like", "with", "from", "in", "on", "at",
      "by", "into", "through", "under", "above", "over", "across"
    ],
    verbs: [
      "run", "jump", "play", "eat", "sleep", "read", "write", "is", "are", "am", "be", "have", "has"
    ],
    objects: [
      "ball", "book", "toy", "apple", "pencil", "dog", "cat", "house", "car", "tree", "puppy", "kitty"
    ]
  };

  sentenceWords: string[] = []; // Array to store words in the current sentence
  showHits: boolean = false; // Flag to control display of word hits

  constructor(private voiceService: VoiceService) { }

  // Getter method to concatenate sentence words into a string
  get sentence(): string {
    return this.sentenceWords.join(' ');
  }

  // Method to add words to the current sentence
  addWordToSentence(words: string[]): void {
    this.sentenceWords.push(...words);
  }

  // Method to clear the current sentence
  clearSentence(): void {
    this.sentenceWords = [];
  }

  // Method to remove the last word from the current sentence
  undo(): void {
    if (this.sentenceWords.length > 0) {
      this.sentenceWords.pop();
    }
  }

  // Method to check if the current sentence is valid and in correct order
  playSentence(): void {
    const utterance = new SpeechSynthesisUtterance(this.sentenceWords.join(' '));
    const selectedVoice = this.voiceService.getSelectedVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
  }

   // Method to check if a word is valid (exists in any word category)
   isValidWord(word: string): boolean {
    return Object.values(this.words).flat().includes(word);
  }

  // Method to check the order of words in the current sentence
  checkSentenceOrder(): { index: number, type: string } {
    const order = ['beginningWords', 'functionWords', 'verbs', 'objects', 'functionWords'];
    for (let i = 0; i < this.sentenceWords.length; i++) {
      const word = this.sentenceWords[i];
      const wordType = order[i];
      if (!this.words[wordType as keyof typeof this.words].includes(word)) {
        return { index: i, type: wordType };
      }
    }
    return { index: -1, type: '' };
  }

  // Method to generate all possible sentences based on word categories
  generateAllSentences(): string[] {
    const sentences: string[] = [];
    const { beginningWords, functionWords, verbs, objects } = this.words;

    for (const beginningWord of beginningWords) {
      for (const functionWord of functionWords) {
        for (const verb of verbs) {
          for (const object of objects) {
            // Construct sentence based on starting word type
            const sentence = (["I", "You", "We", "They"].includes(beginningWord))
              ? [beginningWord, verb, object]
              : [beginningWord, functionWord, verb, object];
            sentences.push(sentence.join(' '));
          }
        }
      }
    }
    return sentences;
  }

  // Method to check if a user-inputted sentence matches any of the generated sentences
  checkUserSentence(sentence: string): boolean {
    const possibleSentences = this.generateAllSentences();
    return possibleSentences.includes(sentence);
  }

  // Method to check if a word in the current sentence is in the correct part of speech order
  checkIncorrectWord(word: string, index: number): boolean {
    const expectedPartOfSpeech = ['beginningWord', 'functionWord', 'verb', 'object', 'functionWord'][index];
    return this.getWordPartOfSpeech(word) !== expectedPartOfSpeech;
  }

  // Method to determine the part of speech of a given word
  getWordPartOfSpeech(word: string): string {
    if (this.words.beginningWords.includes(word)) return 'beginningWord';
    if (this.words.functionWords.includes(word)) return 'functionWord';
    if (this.words.verbs.includes(word)) return 'verb';
    if (this.words.objects.includes(word)) return 'object';
    return 'unknown'; // Return unknown if word doesn't match any category
  }
}
