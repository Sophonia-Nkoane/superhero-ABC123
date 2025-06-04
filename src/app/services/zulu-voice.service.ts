import { Injectable } from '@angular/core';
import { VoiceService } from './voice.service';

@Injectable({
  providedIn: 'root'
})
export class ZuluVoiceService {
  constructor(private voiceService: VoiceService) {}

  getVoices(): SpeechSynthesisVoice[] {
    return this.voiceService.getVoices('zu');
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.voiceService.getSelectedVoice('Zulu');
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null) {
    this.voiceService.setSelectedVoice(voice, 'Zulu');
  }

  getVoiceByName(name: string): SpeechSynthesisVoice | null {
    return this.voiceService.getVoiceByName(name, 'zu');
  }

  setRate(rate: number) {
    this.voiceService.setRate(rate);
  }

  setRepeat(repeat: boolean) {
    this.voiceService.setRepeat(repeat);
  }

  resetVoiceSettings() {
    this.voiceService.resetVoiceSettings('Zulu');
  }
}
