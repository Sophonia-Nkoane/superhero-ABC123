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
    subjects: ["I", "The boy", "The girl", "He", "She", "It", "The dog", "The cat", "We", "They"],
    actions: ["Eat", "Play", "Run", "Jump", "Read", "Write", "Draw", "Paint", "Sing", "Dance"],
    objects: ["Apples", "Ball", "Book", "Toy", "Game", "Pencil", "Paper", "Crayon", "Paintbrush", "Guitar"]
  };

  sentenceWords: string[] = []; // Array to store words in the current sentence
  showHits: boolean = false; // Flag to control display of word hits
  currentWordIndex = -1; // Index of the current word in the sentence

  constructor(private voiceService: VoiceService) { }

  // Getter method to concatenate sentence words into a string
  get sentence(): string {
    return this.sentenceWords.join(' ');
  }

  // Method to add words to the current sentence
  addWordToSentence(word: string): void {
    this.sentenceWords.push(word);
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
    const words = this.sentenceWords;
    let index = 0;
    const voiceRate = this.voiceService.getRate();
    const repeat = this.voiceService.getRepeat();
    const intervalTime = 1200 / voiceRate; // Adjust interval time based on voice rate

    const interval = setInterval(() => {
      if (index > 0) {
        this.currentWordIndex = -1;
      }
      if (index < words.length) {
        this.currentWordIndex = index;
        this.readWord(words[index], voiceRate, repeat);
        index++;
        if (repeat) {
          setTimeout(() => {
            this.readWord(words[index - 1], voiceRate, false);
          }, intervalTime);
        }
      } else {
        clearInterval(interval);
        this.currentWordIndex = -1;
      }
    }, intervalTime * (repeat ? 2 : 1));
  }

  readWord(word: string, rate: number, repeat: boolean) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    const selectedVoice = this.voiceService.getSelectedVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

  // Method to check the order of words in the current sentence
  checkSentenceOrder(): { index: number, type: string } {
    const order = ['subjects', 'actions', 'objects'];
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
    const { subjects, actions, objects } = this.words;

    for (const subject of subjects) {
      for (const action of actions) {
        for (const object of objects) {
          const sentence = [subject, action, object];
          sentences.push(sentence.join(' '));
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
    const expectedPartOfSpeech = ['subject', 'action', 'object'][index];
    return this.getWordPartOfSpeech(word) !== expectedPartOfSpeech;
  }

  // Method to determine the part of speech of a given word
  // Method to determine the part of speech of a given word
  getWordPartOfSpeech(word: string): string {
    if (this.words.subjects.includes(word)) return 'subject';
    if (this.words.actions.includes(word)) return 'action';
    if (this.words.objects.includes(word)) return 'object';
    return 'unknown'; // Return unknown if word doesn't match any category
  }

  getWordStyle(index: number): any {
    return {
      'highlighted-word': index === this.currentWordIndex
    };
  }
}

