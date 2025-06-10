import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZuluVoiceService {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1;

  constructor() {
    if ('speechSynthesis' in window) {
      this.populateVoices();
      speechSynthesis.onvoiceschanged = () => this.populateVoices();
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }
    this.loadStoredVoice();
  }

  private populateVoices() {
    this.voices = speechSynthesis.getVoices().filter(voice =>
      voice.lang.startsWith('zu')
    );
  }

  private loadStoredVoice() {
    const storedVoiceId = localStorage.getItem('selectedVoiceZulu');
    this.selectedVoice = this.voices.find(voice => this.getVoiceId(voice) === storedVoiceId) || this.voices[0] || null;
  }

  private getVoiceId(voice: SpeechSynthesisVoice): string {
    return `${voice.name}-${voice.lang}`;
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null) {
    this.selectedVoice = voice;
    localStorage.setItem('selectedVoiceZulu', voice ? this.getVoiceId(voice) : '');
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getVoiceByName(name: string): SpeechSynthesisVoice | null {
    return this.voices.find(voice => voice.name === name) || null;
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  resetVoiceSettings() {
    this.selectedVoice = this.voices[0] || null;
    localStorage.removeItem('selectedVoiceZulu');
  }
}
