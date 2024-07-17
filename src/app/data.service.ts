import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WordFamily {
  id: number;
  group: 'Vowels' | 'Consonants';
  prefix: string;
  words: string[];
}

export interface Object {
  id: number;
  letter: string;
  object: string;
  icon: string;
}

export interface Words {
  subjects: string[];
  actions: string[];
  objects: string[];
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private wordFamilies: BehaviorSubject<WordFamily[]> = new BehaviorSubject<WordFamily[]>([]);
  private objects: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  private words: BehaviorSubject<Words> = new BehaviorSubject<Words>({
    subjects: [],
    actions: [],
    objects: []
  });

  private readonly alphabet: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
  private readonly vowels: string[] = ['a', 'e', 'i', 'o', 'u'];
  private section1Array: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private section2Array: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private section3Array: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Load data from localStorage or use default values
    this.wordFamilies.next(this.getFromLocalStorage('wordFamilies', []));
    this.objects.next(this.getFromLocalStorage('objects', []));
    this.words.next(this.getFromLocalStorage('words', { subjects: [], actions: [], objects: [] }));
    this.section1Array.next(this.getFromLocalStorage('section1', []));
    this.section2Array.next(this.getFromLocalStorage('section2', []));
    this.section3Array.next(this.getFromLocalStorage('section3', []));
  }

  private getFromLocalStorage<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  private saveToLocalStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Word Families CRUD operations
  getWordFamilies(): Observable<WordFamily[]> {
    return this.wordFamilies.asObservable();
  }

  addWordFamily(wordFamily: Omit<WordFamily, 'id'>): void {
    const currentWordFamilies = this.wordFamilies.value;
    const newId = currentWordFamilies.length > 0 ? Math.max(...currentWordFamilies.map(wf => wf.id)) + 1 : 1;
    const updatedWordFamilies = [...currentWordFamilies, { ...wordFamily, id: newId }];
    this.wordFamilies.next(updatedWordFamilies);
    this.saveToLocalStorage('wordFamilies', updatedWordFamilies);
  }

  updateWordFamily(id: number, updatedWordFamily: Partial<WordFamily>): void {
    const currentWordFamilies = this.wordFamilies.value;
    const updatedWordFamilies = currentWordFamilies.map(wf =>
      wf.id === id ? { ...wf, ...updatedWordFamily } : wf
    );
    this.wordFamilies.next(updatedWordFamilies);
    this.saveToLocalStorage('wordFamilies', updatedWordFamilies);
  }

  deleteWordFamily(id: number): void {
    const currentWordFamilies = this.wordFamilies.value;
    const updatedWordFamilies = currentWordFamilies.filter(wf => wf.id !== id);
    this.wordFamilies.next(updatedWordFamilies);
    this.saveToLocalStorage('wordFamilies', updatedWordFamilies);
  }

  // Objects CRUD operations
  getObjects(): Observable<Object[]> {
    return this.objects.asObservable();
  }

  addObject(object: Omit<Object, 'id'>): void {
    const currentObjects = this.objects.value;
    const newId = currentObjects.length > 0 ? Math.max(...currentObjects.map(obj => obj.id)) + 1 : 1;
    const updatedObjects = [...currentObjects, { ...object, id: newId }];
    this.objects.next(updatedObjects);
    this.saveToLocalStorage('objects', updatedObjects);
  }

  updateObject(id: number, updatedObject: Partial<Object>): void {
    const currentObjects = this.objects.value;
    const updatedObjects = currentObjects.map(obj =>
      obj.id === id ? { ...obj, ...updatedObject } : obj
    );
    this.objects.next(updatedObjects);
    this.saveToLocalStorage('objects', updatedObjects);
  }

  deleteObject(id: number): void {
    const currentObjects = this.objects.value;
    const updatedObjects = currentObjects.filter(obj => obj.id !== id);
    this.objects.next(updatedObjects);
    this.saveToLocalStorage('objects', updatedObjects);
  }

  // Methods for alphabet and vowels
  getAlphabet(): string[] {
    return this.alphabet;
  }

  getVowels(): string[] {
    return this.vowels;
  }

  // Section 1 CRUD operations
  getSection1Array(): Observable<string[]> {
    return this.section1Array.asObservable();
  }

  addSection1Word(word: string): void {
    const currentWords = this.section1Array.value;
    if (!currentWords.includes(word)) {
      const updatedWords = [...currentWords, word];
      this.section1Array.next(updatedWords);
      this.saveToLocalStorage('section1', updatedWords);
    }
  }

  updateSection1Word(oldWord: string, newWord: string): void {
    const currentWords = this.section1Array.value;
    const updatedWords = currentWords.map(w => w === oldWord ? newWord : w);
    this.section1Array.next(updatedWords);
    this.saveToLocalStorage('section1', updatedWords);
  }

  deleteSection1Word(word: string): void {
    const currentWords = this.section1Array.value;
    const updatedWords = currentWords.filter(w => w !== word);
    this.section1Array.next(updatedWords);
    this.saveToLocalStorage('section1', updatedWords);
  }

  // Section 2 CRUD operations
  getSection2Array(): Observable<string[]> {
    return this.section2Array.asObservable();
  }

  addSection2Sentence(sentence: string): void {
    const currentSentences = this.section2Array.value;
    if (!currentSentences.includes(sentence)) {
      const updatedSentences = [...currentSentences, sentence];
      this.section2Array.next(updatedSentences);
      this.saveToLocalStorage('section2', updatedSentences);
    }
  }

  updateSection2Sentence(oldSentence: string, newSentence: string): void {
    const currentSentences = this.section2Array.value;
    const updatedSentences = currentSentences.map(s => s === oldSentence ? newSentence : s);
    this.section2Array.next(updatedSentences);
    this.saveToLocalStorage('section2', updatedSentences);
  }

  deleteSection2Sentence(sentence: string): void {
    const currentSentences = this.section2Array.value;
    const updatedSentences = currentSentences.filter(s => s !== sentence);
    this.section2Array.next(updatedSentences);
    this.saveToLocalStorage('section2', updatedSentences);
  }

  // Section 3 CRUD operations
  getSection3Array(): Observable<string[]> {
    return this.section3Array.asObservable();
  }

  addSection3Word(word: string): void {
    const currentWords = this.section3Array.value;
    if (!currentWords.includes(word)) {
      const updatedWords = [...currentWords, word];
      this.section3Array.next(updatedWords);
      this.saveToLocalStorage('section3', updatedWords);
    }
  }

  updateSection3Word(oldWord: string, newWord: string): void {
    const currentWords = this.section3Array.value;
    const updatedWords = currentWords.map(w => w === oldWord ? newWord : w);
    this.section3Array.next(updatedWords);
    this.saveToLocalStorage('section3', updatedWords);
  }

  deleteSection3Word(word: string): void {
    const currentWords = this.section3Array.value;
    const updatedWords = currentWords.filter(w => w !== word);
    this.section3Array.next(updatedWords);
    this.saveToLocalStorage('section3', updatedWords);
  }

  // Words CRUD operations
  getWords(): Observable<Words> {
    return this.words.asObservable();
  }

  updateWords(newWords: Partial<Words>): void {
    const currentWords = this.words.value;
    const updatedWords = { ...currentWords, ...newWords } as Words;
    this.words.next(updatedWords);
    this.saveToLocalStorage('words', updatedWords);
  }

  addWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    if (currentWords[category].includes(word)) return; // Prevent duplicates
    const updatedWords = {
      ...currentWords,
      [category]: [...currentWords[category], word]
    };
    this.words.next(updatedWords);
    this.saveToLocalStorage('words', updatedWords);
  }

  removeWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    const updatedWords = {
      ...currentWords,
      [category]: currentWords[category].filter(w => w !== word)
    };
    this.words.next(updatedWords);
    this.saveToLocalStorage('words', updatedWords);
  }
}
