import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalSettingsService } from '../../services/global-settings.service';
import { VoiceService } from '../../services/voice.service';
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
    private globalSettingsService: GlobalSettingsService,
    private voiceService: VoiceService
  ) {}

  async ngOnInit() {
    await this.loadVoices();
    this.loadSavedSettings();
  }

  private loadVoices(): Promise<void> {
    return new Promise<void>(resolve => {
      this.englishVoices = this.voiceService.getVoices('en');
      this.afrikaansVoices = this.voiceService.getVoices('af');
      this.zuluVoices = this.voiceService.getVoices('zu');
      resolve();
    });
  }

  private loadSavedSettings() {
    this.selectedVoiceEnglish = this.voiceService.getSelectedVoice('English');
    this.selectedVoiceAfrikaans = this.voiceService.getSelectedVoice('Afrikaans');
    this.selectedVoiceZulu = this.voiceService.getSelectedVoice('Zulu');

    this.voiceRate = this.voiceService.getRate();
    this.repeatWords = this.voiceService.getRepeat();

    this.selectedLanguage = this.globalSettingsService.getLanguage();
  }

  saveSelectedVoice(language: 'English' | 'Afrikaans' | 'Zulu') {
    switch (language) {
      case 'English':
        this.voiceService.setSelectedVoice(this.selectedVoiceEnglish, 'English');
        break;
      case 'Afrikaans':
        this.voiceService.setSelectedVoice(this.selectedVoiceAfrikaans, 'Afrikaans');
        break;
      case 'Zulu':
        this.voiceService.setSelectedVoice(this.selectedVoiceZulu, 'Zulu');
        break;
    }
  }

  async changeLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.globalSettingsService.setLanguage(language);
    this.selectedLanguage = language;
    await this.loadVoices();
  }

  setVoiceRate(rate: number) {
    this.voiceRate = rate;
    this.voiceService.setRate(rate);
  }

  onVoiceChange(event: Event, language: 'English' | 'Afrikaans' | 'Zulu') {
    const voice = language === 'English' ? this.selectedVoiceEnglish :
                 language === 'Afrikaans' ? this.selectedVoiceAfrikaans :
                 this.selectedVoiceZulu;

    if (voice) {
      this.voiceService.setSelectedVoice(voice, language);
      console.log(`Selected ${language} voice:`, voice);
    }
    this.saveSelectedVoice(language);
  }

  onRepeatChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.repeatWords = inputElement?.checked ?? false;

    this.voiceService.setRepeat(this.repeatWords);
  }

  async resetSettings() {
    this.voiceService.resetVoiceSettings('English');
    this.voiceService.resetVoiceSettings('Afrikaans');
    this.voiceService.resetVoiceSettings('Zulu');
    this.voiceService.resetRate();
    this.voiceService.setRepeat(false);

    this.voiceRate = 1;
    this.repeatWords = false;
    this.selectedVoiceEnglish = this.englishVoices.length > 0 ? this.englishVoices[0] : null;
    this.selectedVoiceAfrikaans = this.afrikaansVoices.length > 0 ? this.afrikaansVoices[0] : null;
    this.selectedVoiceZulu = this.zuluVoices.length > 0 ? this.zuluVoices[0] : null;
    this.globalSettingsService.setLanguage('English');
    this.selectedLanguage = 'English';
    await this.loadVoices();
    alert('Settings reset!');
  }

  saveSettings() {
    this.globalSettingsService.setLanguage(this.selectedLanguage);
    alert('Settings saved!');
  }
}
