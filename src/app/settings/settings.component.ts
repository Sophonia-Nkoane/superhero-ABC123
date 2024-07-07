import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  voices: SpeechSynthesisVoice[] = [];
  englishVoices: SpeechSynthesisVoice[] = [];
  afrikaansVoices: SpeechSynthesisVoice[] = [];
  zuluVoices: SpeechSynthesisVoice[] = [];
  selectedVoiceEnglish: SpeechSynthesisVoice | null = null;
  selectedVoiceAfrikaans: SpeechSynthesisVoice | null = null;
  selectedVoiceZulu: SpeechSynthesisVoice | null = null;
  voiceRate: number;
  repeatWords: boolean;
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  constructor(private voiceService: VoiceService) {
    this.voiceRate = this.voiceService.getRate();
    this.repeatWords = this.voiceService.getRepeat();
  }

  ngOnInit() {
    this.voices = this.voiceService.getVoices();
    this.filterVoices();
    this.loadSettings();
  }

  filterVoices() {
    this.englishVoices = this.voices.filter(voice => voice.lang.startsWith('en'));
    this.afrikaansVoices = this.voices.filter(voice => voice.lang.startsWith('af'));
    this.zuluVoices = this.voices.filter(voice => voice.lang.startsWith('zu'));
  }

  loadSettings() {
    const savedVoiceEnglish = localStorage.getItem('selectedVoiceEnglish');
    const savedVoiceAfrikaans = localStorage.getItem('selectedVoiceAfrikaans');
    const savedVoiceZulu = localStorage.getItem('selectedVoiceZulu');

    if (savedVoiceEnglish) {
      this.selectedVoiceEnglish = this.englishVoices.find(voice => voice.name === savedVoiceEnglish) || null;
    }
    if (savedVoiceAfrikaans) {
      this.selectedVoiceAfrikaans = this.afrikaansVoices.find(voice => voice.name === savedVoiceAfrikaans) || null;
    }
    if (savedVoiceZulu) {
      this.selectedVoiceZulu = this.zuluVoices.find(voice => voice.name === savedVoiceZulu) || null;
    }

    const savedRate = localStorage.getItem('voiceRate');
    if (savedRate !== null) {
      this.voiceRate = parseFloat(savedRate);
    }

    const savedRepeat = localStorage.getItem('repeatWords');
    if (savedRepeat !== null) {
      this.repeatWords = savedRepeat === 'true';
    }
  }

  saveSettings(): void {
    localStorage.setItem('voiceRate', this.voiceRate.toString());
    localStorage.setItem('selectedVoiceEnglish', this.selectedVoiceEnglish ? this.selectedVoiceEnglish.name : '');
    localStorage.setItem('selectedVoiceAfrikaans', this.selectedVoiceAfrikaans ? this.selectedVoiceAfrikaans.name : '');
    localStorage.setItem('selectedVoiceZulu', this.selectedVoiceZulu ? this.selectedVoiceZulu.name : '');
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  resetSettings(): void {
    localStorage.removeItem('voiceRate');
    localStorage.removeItem('selectedVoiceEnglish');
    localStorage.removeItem('selectedVoiceAfrikaans');
    localStorage.removeItem('selectedVoiceZulu');
    localStorage.removeItem('repeatWords');
    this.voiceRate = 1;
    this.repeatWords = false;
    this.selectedVoiceEnglish = this.englishVoices.length > 0 ? this.englishVoices[0] : null;
    this.selectedVoiceAfrikaans = this.afrikaansVoices.length > 0 ? this.afrikaansVoices[0] : null;
    this.selectedVoiceZulu = this.zuluVoices.length > 0 ? this.zuluVoices[0] : null;
    this.voiceService.setRate(1);
    this.voiceService.setRepeat(false);
    this.voiceService.setSelectedVoice(this.selectedVoiceEnglish!);
  }

  setVoiceRate(rate: number): void {
    this.voiceRate = rate;
    const mappedRate = this.mapVoiceRate(rate);
    this.voiceService.setRate(mappedRate);
  }

  mapVoiceRate(rate: number): number {
    const mapping: { [key: string]: number } = {
      '-2': 0.1,
      '-1': 0.25,
      '-0.5': 0.5,
      '0': 0.75,
      '0.5': 1,
      '1': 1.25,
      '1.5': 1.5,
      '2': 1.75
    };
    return mapping[rate.toString()] || 1;
  }

  onVoiceChange(language: 'English' | 'Afrikaans' | 'Zulu', event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVoice = this.voices.find(voice => voice.name === selectElement.value);
    if (selectedVoice) {
      if (language === 'English') {
        this.selectedVoiceEnglish = selectedVoice;
      } else if (language === 'Afrikaans') {
        this.selectedVoiceAfrikaans = selectedVoice;
      } else if (language === 'Zulu') {
        this.selectedVoiceZulu = selectedVoice;
      }
      this.voiceService.setSelectedVoice(selectedVoice);
      this.saveSettings();
    }
  }

  onRepeatChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.repeatWords = inputElement.checked;
    this.voiceService.setRepeat(this.repeatWords);
    this.saveSettings();
  }

  onLanguageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value as 'English' | 'Afrikaans' | 'Zulu';
    this.language = language;
    this.voiceService.updateLanguage(language);
    this.saveSettings();
  }
}
