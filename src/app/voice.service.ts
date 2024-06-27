// voice.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1;

  constructor() {
    this.populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.populateVoices();
    }
  }

  private populateVoices() {
    this.voices = speechSynthesis.getVoices();
    this.selectedVoice = this.voices[0]; // Default to the first voice
  }

  setSelectedVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  getRate(): number {
    return this.rate;
  }

  resetVoiceSettings() {
    this.selectedVoice = this.voices[0];
  }

  resetRate() {
    this.rate = 1;
  }

  playText(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    speechSynthesis.speak(utterance);
  }

  playWords(words: string[]) {
    const text = words.join(', ');
    this.playText(text);
  }
}
