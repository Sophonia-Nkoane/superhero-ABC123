import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnglishVoiceService } from '../../services/english-voice.service';
import { AfrikaansVoiceService } from '../../services/afrikaans-voice.service';
import { ZuluVoiceService } from '../../services/zulu-voice.service';
import { GlobalSettingsService } from '../../services/global-settings.service';
import { RouterModule } from '@angular/router'; // Assuming this is for routing to this component

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  voiceRate: number = 1; // Stores the slider value (-2 to 2)
  repeatWords: boolean = false;
  selectedLanguage: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  voicesLoaded = false;
  languageStatus: { [key: string]: string } = {
    English: 'Loading voices...',
    Afrikaans: 'Loading voices...',
    Zulu: 'Loading voices...'
  };

  constructor(
    public englishVoiceService: EnglishVoiceService,
    private afrikaansVoiceService: AfrikaansVoiceService,
    private zuluVoiceService: ZuluVoiceService,
    private globalSettingsService: GlobalSettingsService
  ) {}

  async ngOnInit() {
    await this.initializeSystemVoices();
    this.loadSavedSettings();
    this.applyRepeatToCurrentLanguageService();
    this.updateLanguageStatus();
    this.voicesLoaded = true;
  }

  private async initializeSystemVoices() {
    if (!window.speechSynthesis || typeof window.speechSynthesis.getVoices !== 'function') {
      console.warn('SpeechSynthesis API or getVoices method not available.');
      Object.keys(this.languageStatus).forEach(lang => this.languageStatus[lang] = 'Speech API not available');
      this.voicesLoaded = true;
      return;
    }

    return new Promise<void>(resolve => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        this.populateComponentVoiceLists(voices);
        resolve();
        return;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        this.populateComponentVoiceLists(voices);
        resolve();
      };
    });
  }

  private populateComponentVoiceLists(voices: SpeechSynthesisVoice[]) {
    this.englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    this.afrikaansVoices = voices.filter(voice => voice.lang.startsWith('af'));
    this.zuluVoices = voices.filter(voice => voice.lang.startsWith('zu'));
    this.updateLanguageStatus();
  }

  private loadSavedSettings() {
    // Load saved language preference first
    this.selectedLanguage = (this.globalSettingsService.getLanguage() as 'English' | 'Afrikaans' | 'Zulu') || 'English';

    // Load saved voices and set defaults if necessary
    const savedEnglishVoice = this.englishVoiceService.getSelectedVoice();
    if (savedEnglishVoice && this.englishVoices.some(v => v.name === savedEnglishVoice.name && v.lang === savedEnglishVoice.lang)) {
      this.selectedVoiceEnglish = savedEnglishVoice;
    } else if (this.englishVoices.length > 0) {
      this.selectedVoiceEnglish = this.englishVoices[0]; // Default
    }

    const savedAfrikaansVoice = this.afrikaansVoiceService.getSelectedVoice();
    if (savedAfrikaansVoice && this.afrikaansVoices.some(v => v.name === savedAfrikaansVoice.name && v.lang === savedAfrikaansVoice.lang)) {
      this.selectedVoiceAfrikaans = savedAfrikaansVoice;
    } else if (this.afrikaansVoices.length > 0) {
      this.selectedVoiceAfrikaans = this.afrikaansVoices[0]; // Default
    }

    const savedZuluVoice = this.zuluVoiceService.getSelectedVoice();
    if (savedZuluVoice && this.zuluVoices.some(v => v.name === savedZuluVoice.name && v.lang === savedZuluVoice.lang)) {
      this.selectedVoiceZulu = savedZuluVoice;
    } else if (this.zuluVoices.length > 0) {
      this.selectedVoiceZulu = this.zuluVoices[0]; // Default
    }

    // Load voice rate
    const savedVoiceRate = localStorage.getItem('voiceRate');
    this.voiceRate = savedVoiceRate ? parseFloat(savedVoiceRate) : 1;
    this.applyVoiceRateToServices(this.voiceRate); // Apply loaded rate to services

    // Load repeat words
    const savedRepeatWords = localStorage.getItem('repeatWords');
    this.repeatWords = savedRepeatWords ? savedRepeatWords === 'true' : false;
    // `applyRepeatToCurrentLanguageService` will be called in ngOnInit after this
  }

  private updateLanguageStatus() {
    this.languageStatus = {
      English: this.englishVoices.length ? `${this.englishVoices.length} voices available` : 'No voices available',
      Afrikaans: this.afrikaansVoices.length ? `${this.afrikaansVoices.length} voices available` : 'No voices available',
      Zulu: this.zuluVoices.length ? `${this.zuluVoices.length} voices available` : 'No voices available'
    };
  }

  // Called when the selected voice name changes via (ngModelChange)
  onVoiceChange(selectedVoiceName: string | null, language: 'English' | 'Afrikaans' | 'Zulu') {
    if (!selectedVoiceName) {
      console.warn(`No voice selected for ${language} or selection cleared.`);
      switch (language) {
        case 'English': this.selectedVoiceEnglish = null; break;
        case 'Afrikaans': this.selectedVoiceAfrikaans = null; break;
        case 'Zulu': this.selectedVoiceZulu = null; break;
      }
      this.saveSelectedVoice(language); // Persist the null selection
      return;
    }

    try {
      let voiceToSet: SpeechSynthesisVoice | null = null;
      switch (language) {
        case 'English':
          voiceToSet = this.englishVoiceService.getVoiceByName(selectedVoiceName);
          this.selectedVoiceEnglish = voiceToSet;
          break;
        case 'Afrikaans':
          voiceToSet = this.afrikaansVoiceService.getVoiceByName(selectedVoiceName);
          this.selectedVoiceAfrikaans = voiceToSet;
          break;
        case 'Zulu':
          voiceToSet = this.zuluVoiceService.getVoiceByName(selectedVoiceName);
          this.selectedVoiceZulu = voiceToSet;
          break;
      }
      if (!voiceToSet) {
        console.warn(`Voice "${selectedVoiceName}" not found for ${language}.`);
      }
      this.saveSelectedVoice(language);
    } catch (error) {
      console.error(`Error setting voice for ${language}:`, error);
    }
  }

  saveSelectedVoice(language: 'English' | 'Afrikaans' | 'Zulu') {
    // Services are responsible for their own persistence (e.g., localStorage)
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
    // this.selectedLanguage is already updated by [(ngModel)]
    this.globalSettingsService.setLanguage(language);
    this.applyRepeatToCurrentLanguageService(); // Apply global repeat setting to the new language's service
    this.updateLanguageStatus();
  }

  private applyVoiceRateToServices(rateValue: number) {
    const mappedRate = this.mapVoiceRate(rateValue);
    this.englishVoiceService.setRate(mappedRate);
    this.afrikaansVoiceService.setRate(mappedRate);
    this.zuluVoiceService.setRate(mappedRate);
  }

  setVoiceRate(rate: number) { // rate is the slider value from -2 to 2
    this.voiceRate = rate;
    this.applyVoiceRateToServices(this.voiceRate);
    localStorage.setItem('voiceRate', this.voiceRate.toString());
  }

  mapVoiceRate(sliderValue: number): number {
    // Mapping from slider value (-2 to 2) to actual speech rate (e.g., 0.1 to 2)
    const mapping: { [key: string]: number } = {
      '-2': 0.25, // Slower
      '-1.5': 0.4,
      '-1': 0.5,
      '-0.5': 0.75,
      '0': 1,     // Normal
      '0.5': 1.25,
      '1': 1.5,
      '1.5': 1.75,
      '2': 2    // Faster
    };
    // Original mapping was a bit different, adjusted slightly for more range.
    // User's original map was: {'-2':0.1,'-1':0.25,'-0.5':0.5,'0':0.75,'0.5':1,'1':1.25,'1.5':1.5,'2':1.75};
    return mapping[sliderValue.toString()] || 1; // Default to normal rate if not found
  }

  // Called by (ngModelChange) on the checkbox
  onRepeatWordsChange(isChecked: boolean) {
    this.repeatWords = isChecked;
    this.applyRepeatToCurrentLanguageService();
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  private applyRepeatToCurrentLanguageService() {
    // The 'repeatWords' flag is global, but applied to the active language service.
    const repeatSetting = this.repeatWords;
    switch (this.selectedLanguage) {
      case 'English':
        this.englishVoiceService.setRepeat(repeatSetting);
        break;
      case 'Afrikaans':
        this.afrikaansVoiceService.setRepeat(repeatSetting);
        break;
      case 'Zulu':
        this.zuluVoiceService.setRepeat(repeatSetting);
        break;
    }
  }

  saveSettings() {
    // This acts as an explicit "commit all current UI state"
    this.englishVoiceService.setSelectedVoice(this.selectedVoiceEnglish);
    this.afrikaansVoiceService.setSelectedVoice(this.selectedVoiceAfrikaans);
    this.zuluVoiceService.setSelectedVoice(this.selectedVoiceZulu);

    localStorage.setItem('voiceRate', this.voiceRate.toString());
    localStorage.setItem('repeatWords', this.repeatWords.toString());

    this.globalSettingsService.setLanguage(this.selectedLanguage); // Persist selected language
    console.log('All settings explicitly saved.');
    // Optionally, provide user feedback (e.g., a toast message)
  }

  resetSettings() {
    // Clear persisted settings
    localStorage.removeItem('voiceRate');
    localStorage.removeItem('repeatWords');
    // Ask services to clear their persisted voice selections
    this.englishVoiceService.setSelectedVoice(null);
    this.afrikaansVoiceService.setSelectedVoice(null);
    this.zuluVoiceService.setSelectedVoice(null);
    // Ask global settings service to reset language (if it persists it)
    // Assuming 'English' is the default language.
    this.globalSettingsService.setLanguage('English');


    // Reset component state to defaults
    this.voiceRate = 1;
    this.repeatWords = false;
    this.selectedLanguage = 'English';

    // Re-apply defaults
    this.selectedVoiceEnglish = this.englishVoices.length > 0 ? this.englishVoices[0] : null;
    this.selectedVoiceAfrikaans = this.afrikaansVoices.length > 0 ? this.afrikaansVoices[0] : null;
    this.selectedVoiceZulu = this.zuluVoices.length > 0 ? this.zuluVoices[0] : null;

    // Persist these new default voice selections through services
    this.saveSelectedVoice('English');
    this.saveSelectedVoice('Afrikaans');
    this.saveSelectedVoice('Zulu');

    this.applyVoiceRateToServices(this.voiceRate);
    this.applyRepeatToCurrentLanguageService();

    this.updateLanguageStatus();
    console.log('Settings reset to defaults.');
  }
}
