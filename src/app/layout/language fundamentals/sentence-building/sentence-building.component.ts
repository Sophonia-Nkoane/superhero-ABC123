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
  level = 1;
  sentences: string[] = [];
  currentSentence = '';
  userInput = '';
  userInputs: string[] = [];
  feedback = '';
  sentenceDisplay: string[] = [];
  missingLetters: string[] = [];

  words: Words = { subjects: [], actions: [], objects: [] };
  sentenceWords: string[] = [];
  currentWordIndex = -1;
  selectedVoice: SpeechSynthesisVoice | null = null;
  isCheckingDisabled = false; // Property to control check button state
  isPlayingDisabled = false; // property to control play button state



  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getSentences().subscribe(sentences => {
      this.sentences = sentences;
      this.setNewSentence();
    });
    this.dataService.getWords().subscribe(words => {
      this.words = words;
    });
  }

  setLevel(newLevel: number) {
    this.level = newLevel;
    this.reset();
  }

  reset() {
    this.userInput = '';
    this.userInputs = [];
    this.missingLetters = [];
    this.feedback = '';
    this.sentenceWords = [];
    this.currentWordIndex = -1;
    this.setNewSentence();
  }

  setNewSentence() {
    const currentIndex = this.sentences.indexOf(this.currentSentence);
    const nextIndex = (currentIndex + 1) % this.sentences.length;
    this.currentSentence = this.sentences[nextIndex];
    this.updateSentenceDisplay();
  }

  updateSentenceDisplay() {
    if (this.level === 1 || this.level === 2) {
      this.sentenceDisplay = this.currentSentence.split(' ');
      this.userInputs = new Array(this.sentenceDisplay.length).fill('');
    } else if (this.level === 4) {
      this.sentenceDisplay = this.currentSentence.split(' ');
      this.missingLetters = this.sentenceDisplay.map(word => this.removeRandomLetters(word));
      this.userInputs = new Array(this.sentenceDisplay.length).fill('');
    }
  }

  removeRandomLetters(word: string): string {
    const letters = word.split('');
    const missingCount = Math.ceil(letters.length / 3);
    for (let i = 0; i < missingCount; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      letters[randomIndex] = '_';
    }
    return letters.join('');
  }

  checkAnswer() {
    if (this.isCheckingDisabled || this.isPlayingDisabled) return; // Prevent multiple clicks

    this.isCheckingDisabled = true; // Disable the button

    if (this.level === 1) {
      if (this.userInput.toLowerCase() === this.currentSentence.toLowerCase()) {
        this.feedback = 'Correct! Great job!';
        this.playSentence();
        setTimeout(() => {
          this.setNewSentence();
          this.isCheckingDisabled = false; // Re-enable the button
        }, 8000);
      } else {
        this.feedback = 'Not quite. Try again!';
        this.isCheckingDisabled = false; // Re-enable the button immediately for incorrect answers
      }
      this.userInput = '';
    }
  }

  checkLevel2Answer() {
    if (this.isCheckingDisabled || this.isPlayingDisabled) return;

    this.isCheckingDisabled = true;

    const userSentence = this.userInputs.join(' ').toLowerCase();
    if (userSentence === this.currentSentence.toLowerCase()) {
      this.feedback = 'Correct! You\'ve completed the sentence!';
      this.playSentence();
      setTimeout(() => {
        this.setNewSentence();
        this.isCheckingDisabled = false;
      }, 5000);
    } else {
      this.feedback = 'Not quite. Listen again and try to fill in the missing words.';
      this.isCheckingDisabled = false;
    }
  }

  checkLevel3Sentence(): void {
    if (this.isCheckingDisabled || this.isPlayingDisabled) return;

    this.isCheckingDisabled = true;

    const orderCheck = this.checkSentenceOrder();
    if (orderCheck.index !== -1) {
      this.feedback = `Incorrect word order. Check the ${orderCheck.type} in your sentence.`;
      this.isCheckingDisabled = false;
    } else if (this.checkUserSentence(this.sentenceWords.join(' '))) {
      this.feedback = 'Correct! You\'ve built a valid sentence!';
      this.playSentence();
      setTimeout(() => {
        this.setNewSentence();
        this.isCheckingDisabled = false;
      }, 5000);
    } else {
      this.feedback = 'Not quite. Try a different combination of words.';
      this.isCheckingDisabled = false;
    }
  }

  checkLevel4Answer() {
    if (this.isCheckingDisabled || this.isPlayingDisabled) return;

    this.isCheckingDisabled = true;

    const isCorrect = this.sentenceDisplay.every((word, index) =>
      word.toLowerCase() === this.userInputs[index].toLowerCase()
    );
    if (isCorrect) {
      this.feedback = 'Correct! You\'ve completed the sentence!';
      this.playSentence();
      setTimeout(() => {
        this.setNewSentence();
        this.isCheckingDisabled = false;
      }, 5000);
    } else {
      this.feedback = 'Not quite. Fill in the missing letters and try again!';
      this.isCheckingDisabled = false;
    }
  }

  isWordCorrect(index: number): boolean {
    return this.userInputs[index].toLowerCase() === this.sentenceDisplay[index].toLowerCase();
  }

  // Level 3 methods
  addWordToSentence(word: string): void {
    this.sentenceWords.push(word);
  }

  clearSentence(): void {
    this.sentenceWords = [];
  }

  undo(): void {
    if (this.sentenceWords.length > 0) {
      this.sentenceWords.pop();
    }
  }

  playWord(index: number): void {
    if (this.isPlayingDisabled) return; // Prevent multiple plays

    this.isPlayingDisabled = true; // Disable the play button
    this.isCheckingDisabled = true; // Also disable the check button during playback

    const word = this.sentenceDisplay[index];
    const voiceRate = this.voiceService.getRate();
    const repeat = this.voiceService.getRepeat();

    this.readWord(word, voiceRate, repeat);

    setTimeout(() => {
      this.isPlayingDisabled = false; // Re-enable the play button
      this.isCheckingDisabled = false; // Re-enable the check button
    }, 1200 / voiceRate * (repeat ? 2 : 1));
  }

  playSentence(): void {
    if (this.isPlayingDisabled) return; // Prevent multiple plays

    this.isPlayingDisabled = true; // Disable the play button
    this.isCheckingDisabled = true; // Also disable the check button during playback

    let words: string[];
    switch (this.level) {
      case 1:
        words = this.sentenceDisplay;
        break;
      case 2:
        words = this.sentenceDisplay;
        break;
      case 3:
        words = this.sentenceWords;
        break;
      case 4:
        words = this.sentenceDisplay;
        break;
      default:
        words = [];
    }

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
        this.isPlayingDisabled = false; // Re-enable the play button
        this.isCheckingDisabled = false; // Re-enable the check button
      }
    }, intervalTime * (repeat ? 2 : 1));
  }

  readWord(word: string, rate: number, repeat: boolean): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

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

  checkUserSentence(sentence: string): boolean {
    const possibleSentences = this.generateAllSentences();
    return possibleSentences.includes(sentence);
  }

  getWordStyle(index: number): any {
    return {
      'highlighted-word': index === this.currentWordIndex
    };
  }
}
