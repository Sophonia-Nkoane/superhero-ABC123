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
  savedVoiceRate: number;

  constructor(private voiceService: VoiceService) {
    this.voiceRate =this.voiceService.getRate();
    this.savedVoiceRate = this.voiceRate;
  }

  setVoiceRate(rate: number): void {
    this.voiceRate = rate;
    const mappedRate = this.mapVoiceRate(rate);
    this.voiceService.setRate(mappedRate);
  }

  // Method to map slider values to speech synthesis rates
  mapVoiceRate(rate: number): number {
    // Define a mapping from slider values to speech synthesis rates
    const mapping = {
      '-1': 0.25,
      '-0.5': 0.5,
      '0': 0.75,
      '0.5': 1,
      '1': 1.25,
      '1.5': 1.5,
      '2': 1.75
    };
    return Object.values(mapping).find(value => String(value) === rate.toString()) || 1;
  }

  saveSettings(): void {
    localStorage.setItem('voiceRate', this.voiceRate.toString());
    this.savedVoiceRate = this.voiceRate;
  }

  resetSettings(): void {
    localStorage.removeItem('voiceRate');
    this.voiceRate = 1; // Default rate
    this.savedVoiceRate = this.voiceRate;
    this.voiceService.setRate(1);
  }

  ngOnInit() {
    this.voices = this.voiceService.getVoices();
    this.selectedVoice = this.voiceService.getSelectedVoice();
    const savedRate = localStorage.getItem('voiceRate');
    if (savedRate !== null) {
      this.voiceRate = parseFloat(savedRate);
      const mappedRate = this.mapVoiceRate(this.voiceRate);
      this.voiceService.setRate(mappedRate);
      this.savedVoiceRate = this.voiceRate;
    }
  }

  onVoiceChange(event: any) {
    const selectedVoice = this.voices.find(voice => voice.name === event.target.value);
    if (selectedVoice) {
      this.voiceService.setSelectedVoice(selectedVoice);
    }
  }
}
