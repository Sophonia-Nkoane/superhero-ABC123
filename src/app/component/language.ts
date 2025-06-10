import { VoiceService } from '../services/voice.service';
import { DataService, Object as DataObject } from '../services/data.service';
import { letterStrokes } from '../Utilities/letter-stroke.data';
import { ElementRef } from '@angular/core';

// NEW: Interface for a single stroke guide
interface Stroke {
  path: string;
  number: number;
  numberPos: { x: number; y: number };
}

// ===============================================
// ALPHABET EXPLORER METHODS (from alphabet.component.ts)
// ===============================================
export async function playAlphabetSound(voiceService: VoiceService, letter: string, language: 'English' | 'Afrikaans'): Promise<void> {
  return voiceService.playText(letter, language);
}

export async function playPhoneticSound(letter: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const audioPath = `assets/phonics/upperCase/${letter}.mp3`;
    const audio = new Audio(audioPath);
    audio.onended = () => resolve();
    audio.onerror = reject;
    audio.play();
  });
}

export async function playObjectSound(voiceService: VoiceService, object: string, language: 'English' | 'Afrikaans'): Promise<void> {
  return voiceService.playText(object, language);
}

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export function getLetterStrokes(letter: string, caseType: 'upper' | 'lower'): Stroke[] {
  return letterStrokes[`${letter.toUpperCase()}_${caseType}`] || [];
}

// ===============================================
// LEARNING COMPONENT METHODS (from learning.component.ts)
// ===============================================
export function playSpeech(voiceService: VoiceService, text: string): void {
  voiceService.playText(text,'English');
}

export function playSpeechWithPhonetics(voiceService: VoiceService, word: string): void {
  // Read individual letters of the word using phonetics
  for (const letter of word.split('')) {
    playPhoneticSound(letter);
  }

  // Then read the full word after a short delay
  setTimeout(() => {
    voiceService.playText(word,'English');
  }, 1500);
}

// ===============================================
// READING COMPONENT METHODS (from reading.component.ts)
// ===============================================
export function playWord(words: string[], index: number) {
  const word = words[index];
  const utterance = new SpeechSynthesisUtterance(word);
  window.speechSynthesis.speak(utterance);
}

// ===============================================
// SPELLING COMPONENT METHODS (from spelling.component.ts)
// ===============================================
export async function playWordAudio(voiceService: VoiceService, word: string, usePhonetics: boolean): Promise<void> {
  let isPlaying = false;
  if (isPlaying) {
    return; // Exit if audio is already playing
  }

  isPlaying = true; // Set the flag to indicate audio is playing

  try {
    // Play full word normally
    await playText(voiceService, word);

    // Wait for the full word to finish playing
    await delay(1000);

    if (usePhonetics) {
      // Play each letter phonetically with spacing
      const letters = word.split('');
      await playLettersPhonetically(letters);
    } else {
      // Play each letter normally with spacing
      await playLettersNormally(voiceService, word);
    }

    // Play full word again
    await delay(1000);
    await playText(voiceService, word);
  } finally {
    isPlaying = false; // Reset the flag after playing is complete
  }
}

// Play letters phonetically with a delay
async function playLettersPhonetically(letters: string[]): Promise<void> {
  for (const letter of letters) {
    await playPhoneticSound(letter);
    await delay(1000); // 1 second pause between letters
  }
}

// Play letters normally with a delay
async function playLettersNormally(voiceService: VoiceService, word: string): Promise<void> {
  const letters = word.split('');
  for (const letter of letters) {
    await playText(voiceService, letter);
    await delay(1000); // 1 second between each letter
  }
}

// Play text using VoiceService
async function playText(voiceService: VoiceService, text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    voiceService.playText(text, 'English');
    // Assuming playText is synchronous, we'll add a small delay before resolving
    setTimeout(resolve, 500 + text.length * 100); // Adjust timing based on text length
  });
}
