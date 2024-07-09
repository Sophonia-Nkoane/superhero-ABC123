import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';
import { GlobalSettingsService } from '../global-settings.service';

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
  voiceRate: number = 1;
  repeatWords: boolean = false;
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  constructor(
    private voiceService: VoiceService,
    private globalSettingsService: GlobalSettingsService
  ) {}

  ngOnInit() {
    this.voices = this.voiceService.getVoices();
    this.filterVoicesByLanguage();
    this.loadSavedSettings();
  }

  filterVoicesByLanguage() {
    this.englishVoices = this.voices.filter(voice => voice.lang.startsWith('en'));
    this.afrikaansVoices = this.voices.filter(voice => voice.lang.startsWith('af'));
    this.zuluVoices = this.voices.filter(voice => voice.lang.startsWith('zu'));
  }

  loadSavedSettings() {
    this.selectedVoiceEnglish = this.getSelectedVoiceFromStorage('selectedVoiceEnglish', this.englishVoices);
    this.selectedVoiceAfrikaans = this.getSelectedVoiceFromStorage('selectedVoiceAfrikaans', this.afrikaansVoices);
    this.selectedVoiceZulu = this.getSelectedVoiceFromStorage('selectedVoiceZulu', this.zuluVoices);

    const savedVoiceRate = localStorage.getItem('voiceRate');
    const savedRepeatWords = localStorage.getItem('repeatWords');
    if (savedVoiceRate) {
      this.voiceRate = parseFloat(savedVoiceRate);
    }
    if (savedRepeatWords) {
      this.repeatWords = savedRepeatWords === 'true';
    }

    this.language = this.globalSettingsService.getLanguage();
  }

  getSelectedVoiceFromStorage(key: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const savedVoiceId = localStorage.getItem(key);
    return voices.find(voice => this.voiceService.getVoiceId(voice) === savedVoiceId) || null;
  }

  saveSelectedVoice(language: 'English' | 'Afrikaans' | 'Zulu') {
    let selectedVoice = null;
    let key = '';
    switch (language) {
      case 'English':
        selectedVoice = this.selectedVoiceEnglish;
        key = 'selectedVoiceEnglish';
        break;
      case 'Afrikaans':
        selectedVoice = this.selectedVoiceAfrikaans;
        key = 'selectedVoiceAfrikaans';
        break;
      case 'Zulu':
        selectedVoice = this.selectedVoiceZulu;
        key = 'selectedVoiceZulu';
        break;
    }

    if (selectedVoice) {
      localStorage.setItem(key, this.voiceService.getVoiceId(selectedVoice));
    }
  }

  changeLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.globalSettingsService.setLanguage(language);
    this.language = language; // Update the current component language
    this.filterVoicesByLanguage(); // Update filtered voices based on new language
  }

  setVoiceRate(rate: number) {
    this.voiceRate = rate;
    const mappedRate = this.mapVoiceRate(rate);
    this.voiceService.setRate(mappedRate);
    localStorage.setItem('voiceRate', this.voiceRate.toString());
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

  onRepeatChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.repeatWords = inputElement.checked;
    this.voiceService.setRepeat(this.repeatWords);
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  saveSettings() {
    localStorage.setItem('selectedVoiceEnglish', this.selectedVoiceEnglish ? this.voiceService.getVoiceId(this.selectedVoiceEnglish) : '');
    localStorage.setItem('selectedVoiceAfrikaans', this.selectedVoiceAfrikaans ? this.voiceService.getVoiceId(this.selectedVoiceAfrikaans) : '');
    localStorage.setItem('selectedVoiceZulu', this.selectedVoiceZulu ? this.voiceService.getVoiceId(this.selectedVoiceZulu) : '');
    localStorage.setItem('voiceRate', this.voiceRate.toString());
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  resetSettings() {
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
    this.globalSettingsService.setLanguage('English'); // Set default language after reset
    this.language = 'English'; // Update the current component language
    this.filterVoicesByLanguage(); // Update filtered voices based on new language
  }
}
