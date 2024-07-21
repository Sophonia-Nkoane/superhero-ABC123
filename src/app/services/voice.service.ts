import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  voices: SpeechSynthesisVoice[] = [];
  selectedVoiceEnglish: SpeechSynthesisVoice | null = null;
  selectedVoiceAfrikaans: SpeechSynthesisVoice | null = null;
  selectedVoiceZulu: SpeechSynthesisVoice | null = null;
  rate: number = 1;
  repeat: boolean = false;

  phonetics: { [key: string]: string } = {
    A: 'ah', B: 'bah', C: 'kuh', D: 'duh', E: 'eh', F: 'fuh', G: 'gah', H: 'hah',
    I: 'i', J: 'jar', K: 'kuh', L: 'la', M: 'm', N: 'nuh', O: 'oh', P: 'puh',
    Q: 'qua', R: 'rah', S: '/s/', T: 'tuh', U: 'uh', V: 'vuh', W: 'wuh', X: 'ks',
    Y: 'yah', Z: 'zah'
  };

  constructor() {
    if ('speechSynthesis' in window) {
      this.populateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.populateVoices();
      }
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }
    this.loadSettings();
  }

  populateVoices() {
    setTimeout(() => {
      this.voices = speechSynthesis.getVoices();
      console.log('Voices loaded:', this.voices);  // Log the loaded voices
      this.setStoredVoices();
      if (this.voices.length === 0) {
        console.warn('No voices found. Ensure you have voices available in your browser.');
      }
    }, 500);  // Slight delay to ensure voices are loaded
  }

  setStoredVoices() {
    this.selectedVoiceEnglish = this.getStoredVoice('selectedVoiceEnglish', 'en');
    this.selectedVoiceAfrikaans = this.getStoredVoice('selectedVoiceAfrikaans', 'af');
    this.selectedVoiceZulu = this.getStoredVoice('selectedVoiceZulu', 'zu');
  }

  getStoredVoice(key: string, langPrefix: string): SpeechSynthesisVoice | null {
    const storedVoiceId = localStorage.getItem(key);
    const voice = this.voices.find(voice => this.getVoiceId(voice) === storedVoiceId && voice.lang.startsWith(langPrefix));
    console.log(`Stored voice for ${key}:`, voice);
    return voice || this.getDefaultVoice(langPrefix);
  }

  getVoiceId(voice: SpeechSynthesisVoice): string {
    return `${voice.name}-${voice.lang}`;
  }

  setSelectedVoice(voice: SpeechSynthesisVoice | null, language: 'English' | 'Afrikaans' | 'Zulu') {
    if (voice) {
      switch (language) {
        case 'English':
          this.selectedVoiceEnglish = voice;
          localStorage.setItem('selectedVoiceEnglish', this.getVoiceId(voice));
          break;
        case 'Afrikaans':
          this.selectedVoiceAfrikaans = voice;
          localStorage.setItem('selectedVoiceAfrikaans', this.getVoiceId(voice));
          break;
        case 'Zulu':
          this.selectedVoiceZulu = voice;
          localStorage.setItem('selectedVoiceZulu', this.getVoiceId(voice));
          break;
      }
      console.log(`Selected voice for ${language}:`, voice);
    } else {
      console.error('Selected voice is null.');
    }
  }

  loadSettings() {
    const savedRate = localStorage.getItem('voiceRate');
    if (savedRate !== null) {
      this.rate = parseFloat(savedRate);
    }
    const savedRepeat = localStorage.getItem('repeatWords');
    if (savedRepeat !== null) {
      this.repeat = savedRepeat === 'true';
    }
  }

  getSelectedVoice(language: 'English' | 'Afrikaans' | 'Zulu'): SpeechSynthesisVoice | null {
    switch (language) {
      case 'English':
        return this.selectedVoiceEnglish;
      case 'Afrikaans':
        return this.selectedVoiceAfrikaans;
      case 'Zulu':
        return this.selectedVoiceZulu;
      default:
        return null;
    }
  }

  getVoices(langPrefix: string): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith(langPrefix));
  }

  getVoiceByName(name: string, langPrefix: string): SpeechSynthesisVoice | null {
    return this.voices.find(voice => voice.name === name && voice.lang.startsWith(langPrefix)) || null;
  }

  getPhonetic(letter: string): string {
    return this.phonetics[letter.toUpperCase()] || letter;
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

  resetVoiceSettings(language: 'English' | 'Afrikaans' | 'Zulu') {
    switch (language) {
      case 'English':
        this.selectedVoiceEnglish = this.getDefaultVoice('en');
        localStorage.removeItem('selectedVoiceEnglish');
        break;
      case 'Afrikaans':
        this.selectedVoiceAfrikaans = this.getDefaultVoice('af');
        localStorage.removeItem('selectedVoiceAfrikaans');
        break;
      case 'Zulu':
        this.selectedVoiceZulu = this.getDefaultVoice('zu');
        localStorage.removeItem('selectedVoiceZulu');
        break;
    }
  }

  getDefaultVoice(langPrefix: string): SpeechSynthesisVoice | null {
    return this.voices.find(voice => voice.lang.startsWith(langPrefix)) || null;
  }

  resetRate() {
    this.rate = 1;
    localStorage.removeItem('voiceRate');
  }

  playText(text: string, language: 'English' | 'Afrikaans' | 'Zulu') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.rate;
      const selectedVoice = this.getSelectedVoice(language);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }
  }

  playWords(words: string[], language: 'English' | 'Afrikaans' | 'Zulu', onWordStart?: (word: string) => void, onWordEnd?: (word: string) => void) {
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
        const selectedVoice = this.getSelectedVoice(language);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
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

  updateLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    localStorage.setItem('language', language);
    this.setStoredVoices();
  }
}
