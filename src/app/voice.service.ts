import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1;
  private repeat: boolean = false;

  constructor() {
    if ('speechSynthesis' in window) {
      this.populateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.populateVoices();
      }
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }
    this.loadSettings(); // Load settings on initialization
  }

  private populateVoices() {
    this.voices = speechSynthesis.getVoices().filter(voice =>
      ['en', 'af', 'zu'].includes(voice.lang.split('-')[0])
    );
    const savedVoiceName = localStorage.getItem('selectedVoice');
    if (savedVoiceName) {
      this.selectedVoice = this.voices.find(voice => voice.name === savedVoiceName) || this.voices[0];
    } else if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0]; // Default to the first voice
    } else {
      console.warn('No speech synthesis voices available.');
    }
  }

  private loadSettings() {
    const savedRate = localStorage.getItem('voiceRate');
    if (savedRate !== null) {
      this.rate = parseFloat(savedRate);
    }
    const savedRepeat = localStorage.getItem('repeatWords');
    if (savedRepeat !== null) {
      this.repeat = savedRepeat === 'true';
    }
  }

  setSelectedVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
    localStorage.setItem('selectedVoice', voice.name);
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  setRate(rate: number) {
    this.rate = rate;
    localStorage.setItem('voiceRate', rate.toString());
  }

  getRate(): number {
    return this.rate;
  }

  setRepeat(repeat: boolean) {
    this.repeat = repeat;
    localStorage.setItem('repeatWords', repeat.toString());
  }

  getRepeat(): boolean {
    return this.repeat;
  }

  resetVoiceSettings() {
    if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0];
      localStorage.removeItem('selectedVoice');
    }
  }

  resetRate() {
    this.rate = 1;
    localStorage.removeItem('voiceRate');
  }

  playText(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.rate;
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }
  }

  playWords(words: string[], onWordStart?: (word: string) => void, onWordEnd?: (word: string) => void) {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported in this browser.');
      return;
    }

    const wordDuration = 1000 / this.rate;
    let wordIndex = 0;

    const speakNextWord = () => {
      if (wordIndex < words.length) {
        const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
        utterance.rate = this.rate;
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        utterance.onstart = () => {
          if (onWordStart) onWordStart(words[wordIndex]);
        };

        utterance.onend = () => {
          if (onWordEnd) onWordEnd(words[wordIndex]);
          wordIndex++;
          speakNextWord();
        };

        speechSynthesis.speak(utterance);
      }
    };

    speakNextWord();
  }

  animateSequence(numberInWordsElement: HTMLElement, numberElement: HTMLElement) {
    const wordDuration = 1000 / this.rate;

    const addAnimation = (element: HTMLElement) => {
      element.style.animation = `fadeInZoom ${wordDuration / 1000}s ease-in-out`;
      element.classList.add('glow');
    };

    const removeAnimation = (element: HTMLElement) => {
      element.style.animation = '';
      element.classList.remove('glow');
    };

    addAnimation(numberInWordsElement);
    setTimeout(() => {
      removeAnimation(numberInWordsElement);
      addAnimation(numberElement);
    }, wordDuration);

    setTimeout(() => {
      removeAnimation(numberElement);
    }, wordDuration * 2);
  }
}
