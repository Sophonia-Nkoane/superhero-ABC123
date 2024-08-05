import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService, Words } from '../../../services/data.service';

@Component({
  selector: 'app-sentence-building',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-building.component.html',
  styleUrls: ['./sentence-building.component.css']
})
export class SentenceBuildingComponent implements OnInit {
  // Initialize words object with empty arrays for subjects, actions, and objects
  words: Words = { subjects: [], actions: [], objects: [] };

  // Array to hold the words of the current sentence
  sentenceWords: string[] = [];
  // Flag to show or hide hints
  showHits: boolean = false;
  // Index of the currently spoken word
  currentWordIndex = -1;
  // Selected voice for speech synthesis
  selectedVoice: SpeechSynthesisVoice | null = null;

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    // Fetch words data from the data service on initialization
    this.dataService.getWords().subscribe(words => {
      this.words = words;
    });
  }

  // Getter to return the sentence as a single string
  get sentence(): string {
    return this.sentenceWords.join(' ');
  }

  // Add a word to the current sentence
  addWordToSentence(word: string): void {
    this.sentenceWords.push(word);
  }

  // Clear all words from the current sentence
  clearSentence(): void {
    this.sentenceWords = [];
  }

  // Remove the last word from the current sentence
  undo(): void {
    if (this.sentenceWords.length > 0) {
      this.sentenceWords.pop();
    }
  }

  // Play the current sentence using the selected voice and settings
  playSentence(): void {
    const words = this.sentenceWords;
    let index = 0;
    const voiceRate = this.voiceService.getRate();
    const repeat = this.voiceService.getRepeat();
    const intervalTime = 1200 / voiceRate;

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

  // Use speech synthesis to read a word
  readWord(word: string, rate: number, repeat: boolean): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

  // Set the selected voice for speech synthesis
  setSelectedVoice(voice: SpeechSynthesisVoice | null): void {
    this.selectedVoice = voice;
  }

  // Check the order of words in the sentence
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

  // Generate all possible sentences from the given words
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

  // Check if the user's sentence is one of the possible correct sentences
  checkUserSentence(sentence: string): boolean {
    const possibleSentences = this.generateAllSentences();
    return possibleSentences.includes(sentence);
  }

  // Check if a word is incorrect at a given index based on expected part of speech
  checkIncorrectWord(word: string, index: number): boolean {
    const expectedPartOfSpeech = ['subject', 'action', 'object'][index];
    return this.getWordPartOfSpeech(word) !== expectedPartOfSpeech;
  }

  // Get the part of speech (subject, action, object) for a given word
  getWordPartOfSpeech(word: string): string {
    if (this.words.subjects.includes(word)) return 'subject';
    if (this.words.actions.includes(word)) return 'action';
    if (this.words.objects.includes(word)) return 'object';
    return 'unknown';
  }

  // Get the style for a word based on its index (used for highlighting)
  getWordStyle(index: number): any {
    return {
      'highlighted-word': index === this.currentWordIndex
    };
  }
}
