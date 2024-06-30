import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  voiceRate: number;
  repeatWords: boolean;

  constructor(private voiceService: VoiceService) {
    this.voiceRate = this.voiceService.getRate();
    this.repeatWords = this.voiceService.getRepeat();
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

  saveSettings(): void {
    localStorage.setItem('voiceRate', this.voiceRate.toString());
    localStorage.setItem('selectedVoice', this.selectedVoice ? this.selectedVoice.name : '');
    localStorage.setItem('repeatWords', this.repeatWords.toString());
  }

  resetSettings(): void {
    localStorage.removeItem('voiceRate');
    localStorage.removeItem('selectedVoice');
    localStorage.removeItem('repeatWords');
    this.voiceRate = 1;
    this.repeatWords = false;
    this.selectedVoice = this.voices.length > 0 ? this.voices[0] : null;
    this.voiceService.setRate(1);
    this.voiceService.setRepeat(false);
    this.voiceService.setSelectedVoice(this.selectedVoice!);
  }

  ngOnInit() {
    this.voices = this.voiceService.getVoices();
    this.loadSettings();
  }

  loadSettings() {
    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice) {
      this.selectedVoice = this.voices.find(voice => voice.name === savedVoice) || null;
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

  onVoiceChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVoice = this.voices.find(voice => voice.name === selectElement.value);
    if (selectedVoice) {
      this.selectedVoice = selectedVoice;
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
}
