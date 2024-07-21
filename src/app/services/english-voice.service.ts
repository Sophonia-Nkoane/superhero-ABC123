import { Injectable } from '@angular/core';
import { VoiceService } from './voice.service';

@Injectable({
  providedIn: 'root'
})
export class EnglishVoiceService {
  constructor(private voiceService: VoiceService) {}

  getVoices(): SpeechSynthesisVoice[] {
    return this.voiceService.getVoices('en');
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.voiceService.getSelectedVoice('English');
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null) {
    this.voiceService.setSelectedVoice(voice, 'English');
  }

  getVoiceByName(name: string): SpeechSynthesisVoice | null {
    return this.voiceService.getVoiceByName(name, 'en');
  }

  setRate(rate: number) {
    this.voiceService.setRate(rate);
  }

  setRepeat(repeat: boolean) {
    this.voiceService.setRepeat(repeat);
  }

  getPhonetic(letter: string): string {
    return this.voiceService.getPhonetic(letter);
  }
}
