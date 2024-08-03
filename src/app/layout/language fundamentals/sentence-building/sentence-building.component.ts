import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService , Words } from '../../../services/data.service';

@Component({
  selector: 'app-sentence-building',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-building.component.html',
  styleUrls: ['./sentence-building.component.css']
})
export class SentenceBuildingComponent implements OnInit {
  words: Words = { subjects: [], actions: [], objects: [] };

  sentenceWords: string[] = [];
  showHits: boolean = false;
  currentWordIndex = -1;
  selectedVoice: SpeechSynthesisVoice | null = null;

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getWords().subscribe(words => {
      this.words = words;
    });
  }

  get sentence(): string {
    return this.sentenceWords.join(' ');
  }

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

  readWord(word: string, rate: number, repeat: boolean): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null): void {
    this.selectedVoice = voice;
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

  checkIncorrectWord(word: string, index: number): boolean {
    const expectedPartOfSpeech = ['subject', 'action', 'object'][index];
    return this.getWordPartOfSpeech(word) !== expectedPartOfSpeech;
  }

  getWordPartOfSpeech(word: string): string {
    if (this.words.subjects.includes(word)) return 'subject';
    if (this.words.actions.includes(word)) return 'action';
    if (this.words.objects.includes(word)) return 'object';
    return 'unknown';
  }

  getWordStyle(index: number): any {
    return {
      'highlighted-word': index === this.currentWordIndex
    };
  }
}
