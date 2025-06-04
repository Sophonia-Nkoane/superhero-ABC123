import { Injectable } from '@angular/core';
import { VoiceService } from './voice.service';

@Injectable({
  providedIn: 'root'
})
export class AfrikaansVoiceService {
  constructor(private voiceService: VoiceService) {}

  getVoices(): SpeechSynthesisVoice[] {
    return this.voiceService.getVoices('af');
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.voiceService.getSelectedVoice('Afrikaans');
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null) {
    this.voiceService.setSelectedVoice(voice, 'Afrikaans');
  }

  getVoiceByName(name: string): SpeechSynthesisVoice | null {
    return this.voiceService.getVoiceByName(name, 'af');
  }

  setRate(rate: number) {
    this.voiceService.setRate(rate);
  }

  setRepeat(repeat: boolean) {
    this.voiceService.setRepeat(repeat);
  }

  resetVoiceSettings() {
    this.voiceService.resetVoiceSettings('Afrikaans');
  }
}
