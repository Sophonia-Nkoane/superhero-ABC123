import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnglishVoiceService } from '../Utilities/english-voice.service';
import { AfrikaansVoiceService } from '../Utilities/afrikaans-voice.service';
import { ZuluVoiceService } from '../Utilities/zulu-voice.service';
import { GlobalSettingsService } from '../Utilities/global-settings.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  englishVoices: SpeechSynthesisVoice[] = [];
  afrikaansVoices: SpeechSynthesisVoice[] = [];
  zuluVoices: SpeechSynthesisVoice[] = [];
  selectedVoiceEnglish: SpeechSynthesisVoice | null = null;
  selectedVoiceAfrikaans: SpeechSynthesisVoice | null = null;
  selectedVoiceZulu: SpeechSynthesisVoice | null = null;
  voiceRate: number = 1;
  repeatWords: boolean = false;
  selectedLanguage: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  constructor(
    public englishVoiceService: EnglishVoiceService,
    private afrikaansVoiceService: AfrikaansVoiceService,
    private zuluVoiceService: ZuluVoiceService,
    private globalSettingsService: GlobalSettingsService
  ) {}

  ngOnInit() {
    this.loadVoices();
    this.loadSavedSettings();
  }

  private loadVoices() {
    this.englishVoices = this.englishVoiceService.getVoices();
    this.afrikaansVoices = this.afrikaansVoiceService.getVoices();
    this.zuluVoices = this.zuluVoiceService.getVoices();
  }

  private loadSavedSettings() {
    this.selectedVoiceEnglish = this.englishVoiceService.getSelectedVoice();
    this.selectedVoiceAfrikaans = this.afrikaansVoiceService.getSelectedVoice();
    this.selectedVoiceZulu = this.zuluVoiceService.getSelectedVoice();

    const savedVoiceRate = localStorage.getItem('voiceRate');
    const savedRepeatWords = localStorage.getItem('repeatWords');
    if (savedVoiceRate) {
      this.voiceRate = parseFloat(savedVoiceRate);
    }
    if (savedRepeatWords) {
      this.repeatWords = savedRepeatWords === 'true';
    }

    this.selectedLanguage = this.globalSettingsService.getLanguage() as 'English' | 'Afrikaans' | 'Zulu';
  }

  saveSelectedVoice(language: 'English' | 'Afrikaans' | 'Zulu') {
    switch (language) {
      case 'English':
        this.englishVoiceService.setSelectedVoice(this.selectedVoiceEnglish);
        break;
      case 'Afrikaans':
        this.afrikaansVoiceService.setSelectedVoice(this.selectedVoiceAfrikaans);
        break;
      case 'Zulu':
        this.zuluVoiceService.setSelectedVoice(this.selectedVoiceZulu);
        break;
    }
  }

  changeLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.globalSettingsService.setLanguage(language);
    this.selectedLanguage = language;
    this.loadVoices();
  }

  setVoiceRate(rate: number) {
    this.voiceRate = rate;
    const mappedRate = this.mapVoiceRate(rate);
    this.englishVoiceService.setRate(mappedRate);
    this.afrikaansVoiceService.setRate(mappedRate);
    this.zuluVoiceService.setRate(mappedRate);
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

  onVoiceChange(event: Event, language: 'English' | 'Afrikaans' | 'Zulu') {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVoiceName = selectElement?.value;

    if (selectedVoiceName) {
      switch (language) {
        case 'English':
          this.selectedVoiceEnglish = this.englishVoiceService.getVoiceByName(selectedVoiceName);
          this.saveSelectedVoice('English');
          break;
        case 'Afrikaans':
          this.selectedVoiceAfrikaans = this.afrikaansVoiceService.getVoiceByName(selectedVoiceName);
          this.saveSelectedVoice('Afrikaans');
          break;
        case 'Zulu':
          this.selectedVoiceZulu = this.zuluVoiceService.getVoiceByName(selectedVoiceName);
          this.saveSelectedVoice('Zulu');
          break;
      }
    }
  }

  onRepeatChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.repeatWords = inputElement?.checked ?? false;

    switch (this.selectedLanguage) {
      case 'English':
        this.englishVoiceService.setRepeat(this.repeatWords);
        break;
      case 'Afrikaans':
        if ('setRepeat' in this.afrikaansVoiceService) {
          (this.afrikaansVoiceService as any).setRepeat(this.repeatWords);
        }
        break;
      case 'Zulu':
        if ('setRepeat' in this.zuluVoiceService) {
          (this.zuluVoiceService as any).setRepeat(this.repeatWords);
        }
        break;
    }
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  saveSettings() {
    this.englishVoiceService.setSelectedVoice(this.selectedVoiceEnglish);
    this.afrikaansVoiceService.setSelectedVoice(this.selectedVoiceAfrikaans);
    this.zuluVoiceService.setSelectedVoice(this.selectedVoiceZulu);
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
    this.setVoiceRate(1);
    this.globalSettingsService.setLanguage('English');
    this.selectedLanguage = 'English';
    this.loadVoices();
  }
}
