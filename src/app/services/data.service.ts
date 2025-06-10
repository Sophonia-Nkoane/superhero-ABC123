import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from './cache.service';

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
  private sentences: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private wordFamilies: BehaviorSubject<WordFamily[]> = new BehaviorSubject<WordFamily[]>([]);
  private objects: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  private words: BehaviorSubject<Words> = new BehaviorSubject<Words>({
    subjects: [],
    actions: [],
    objects: []
  });
  private passage: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]); // Initialize empty, load from cache

  private readonly alphabet: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
  private readonly vowels: string[] = ['a', 'e', 'i', 'o', 'u'];
  private section1Array: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private section2Array: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  private readonly defaultSentences: string[] = [
    "My dad is in the bed.",
    "I think we must go.",
    "My friend is sleeping.",
    "I think we have a dog."
  ];

  private readonly defaultWordFamilies: WordFamily[] = [
    { id: 1, group: 'Vowels', prefix: 'at', words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat'] },
    { id: 2, group: 'Vowels', prefix: 'an', words: ['can', 'fan', 'man', 'van', 'tan', 'pan', 'scan', 'plan'] },
    { id: 3, group: 'Consonants', prefix: 'in', words: ['pin', 'tin', 'win', 'din', 'kin', 'lin', 'min', 'sin'] },
    { id: 4, group: 'Consonants', prefix: 'en', words: ['pen', 'ten', 'hen', 'men', 'den', 'len', 'wen', 'gen'] },
    { id: 5, group: 'Vowels', prefix: 'ot', words: ['not', 'hot', 'pot', 'rot', 'tot', 'dot', 'got', 'lot'] },
    { id: 6, group: 'Vowels', prefix: 'un', words: ['fun', 'run', 'sun', 'bun', 'gun', 'hun', 'mun', 'pun'] },
    { id: 7, group: 'Consonants', prefix: 'et', words: ['get', 'set', 'vet', 'bet', 'jet', 'let', 'met', 'net'] },
    { id: 8, group: 'Consonants', prefix: 'it', words: ['sit', 'kit', 'lit', 'mit', 'nit', 'pit', 'rit', 'wit'] },
    { id: 9, group: 'Consonants', prefix: 'ut', words: ['cut', 'gut', 'hut', 'lut', 'mut', 'nut', 'put', 'rut'] },
    { id: 10, group: 'Vowels', prefix: 'am', words: ['cam', 'ham', 'jam', 'lam', 'mam', 'ram', 'sam', 'dam'] },
    { id: 11, group: 'Vowels', prefix: 'em', words: ['gem', 'hem', 'lem', 'mem', 'nem', 'rem', 'sem', 'them'] },
    { id: 12, group: 'Consonants', prefix: 'im', words: ['him', 'lim', 'rim', 'sim', 'tim', 'vim', 'whim', 'brim'] }
  ];

  private readonly defaultObjects: Object[] = [
    { id: 1, letter: 'A', object: 'Apple', icon: '🍎' },
    { id: 2, letter: 'B', object: 'Boy', icon: '👦' },
    { id: 3, letter: 'C', object: 'Cat', icon: '🐈' },
    { id: 4, letter: 'D', object: 'Dog', icon: '🐕' },
    { id: 5, letter: 'E', object: 'Elephant', icon: '🐘' },
    { id: 6, letter: 'F', object: 'Fish', icon: '🐟' },
    { id: 7, letter: 'G', object: 'Girl', icon: '👧' },
    { id: 8, letter: 'H', object: 'House', icon: '🏠' },
    { id: 9, letter: 'I', object: 'Ice-cream', icon: '🍦' },
    { id: 10, letter: 'J', object: 'Jet', icon: '🛩️' },
    { id: 11, letter: 'K', object: 'Kite', icon: '🪁' },
    { id: 12, letter: 'L', object: 'Lion', icon: '🦁' },
    { id: 13, letter: 'M', object: 'Mouse', icon: '🐭' },
    { id: 14, letter: 'N', object: 'Nose', icon: '👃' },
    { id: 15, letter: 'O', object: 'Ocean', icon: '🌊' },
    { id: 16, letter: 'P', object: 'Penguin', icon: '🐧' },
    { id: 17, letter: 'Q', object: 'Queen', icon: '👑' },
    { id: 18, letter: 'R', object: 'Robot', icon: '🤖' },
    { id: 19, letter: 'S', object: 'Sun', icon: '☀️' },
    { id: 20, letter: 'T', object: 'Tiger', icon: '🐯' },
    { id: 21, letter: 'U', object: 'Umbrella', icon: '☔️' },
    { id: 22, letter: 'V', object: 'Violin', icon: '🎻' },
    { id: 23, letter: 'W', object: 'Whale', icon: '🐳' },
    { id: 24, letter: 'X', object: 'X-ray', icon: '🔍' },
    { id: 25, letter: 'Y', object: 'Yacht', icon: '🛥️' },
    { id: 26, letter: 'Z', object: 'Zebra', icon: '🦓' },
  ];

  private readonly defaultWords: Words = {
    subjects: ["I", "The boy", "The girl", "He", "She", "It", "The dog", "The cat", "We", "They"],
    actions: ["Eat", "Play", "Run", "Jump", "Read", "Write", "Draw", "Paint", "Sing", "Dance"],
    objects: ["Apples", "Ball", "Book", "Toy", "Game", "Pencil", "Paper", "Crayon", "Paintbrush", "Guitar"]
  };

  private readonly defaultSection1: string[] = ['red', 'chum','job', 'pigs', 'shy', 'hat','club', 'six', 'flag', 'sleeping', 'friend', 'think', 'must', 'hop', 'chin', 'frog', 'looking'];
  private readonly defaultSection3: string[] = ['-og', '-in', '-op', '-at', 'jog', 'win', 'pop', 'mat', 'frog', 'bin', 'mop', 'cat', 'hop', 'fin', 'hop', 'pat'];
  private readonly defaultPassage: string[] = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs."
  ];


  constructor(private cacheService: CacheService) {
    this.initializeData();
  }

  private initializeData(): void {
    this.wordFamilies.next(this.cacheService.getItem('wordFamilies') || this.defaultWordFamilies);
    this.objects.next(this.cacheService.getItem('objects') || this.defaultObjects);
    this.words.next(this.cacheService.getItem('words') || this.defaultWords);
    this.section1Array.next(this.cacheService.getItem('section1') || this.defaultSection1);
    this.section2Array.next(this.cacheService.getItem('section2') || this.defaultSection3); // Corrected key to 'section2'
    this.sentences.next(this.cacheService.getItem('sentences') || this.defaultSentences);
    this.passage.next(this.cacheService.getItem('passage') || this.defaultPassage); // Load passage from cache
  }

  resetToDefaults(): void {
    this.wordFamilies.next(this.defaultWordFamilies);
    this.objects.next(this.defaultObjects);
    this.words.next(this.defaultWords);
    this.section1Array.next(this.defaultSection1);
    this.section2Array.next(this.defaultSection3);
    this.sentences.next(this.defaultSentences);
    this.passage.next(this.defaultPassage); // Reset passage

    this.cacheService.setItem('sentences', this.defaultSentences);
    this.cacheService.setItem('wordFamilies', this.defaultWordFamilies);
    this.cacheService.setItem('objects', this.defaultObjects);
    this.cacheService.setItem('words', this.defaultWords);
    this.cacheService.setItem('section1', this.defaultSection1);
    this.cacheService.setItem('section2', this.defaultSection3); // Corrected key to 'section2'
    this.cacheService.setItem('passage', this.defaultPassage); // Save default passage
  }

  // Sentences CRUD operations
  getSentences(): Observable<string[]> {
    return this.sentences.asObservable();
  }

  addSentence(sentence: string): void {
    const currentSentences = this.sentences.value;
    if (!currentSentences.includes(sentence)) {
      const updatedSentences = [...currentSentences, sentence];
      this.sentences.next(updatedSentences);
      this.cacheService.setItem('sentences', updatedSentences);
    }
  }

  updateSentence(oldSentence: string, newSentence: string): void {
    const currentSentences = this.sentences.value;
    const updatedSentences = currentSentences.map(s => s === oldSentence ? newSentence : s);
    this.sentences.next(updatedSentences);
    this.cacheService.setItem('sentences', updatedSentences);
  }

  deleteSentence(sentence: string): void {
    const currentSentences = this.sentences.value;
    const updatedSentences = currentSentences.filter(s => s !== sentence);
    this.sentences.next(updatedSentences);
    this.cacheService.setItem('sentences', updatedSentences);
  }

  // CRUD operations for passage
getPassage(): Observable<string[]> {
  return this.passage.asObservable();
}

addPassage(sentence: string): void {
  const currentPassage = this.passage.value;
  if (!currentPassage.includes(sentence)) {
    const updatedPassage = [...currentPassage, sentence];
    this.passage.next(updatedPassage);
    this.cacheService.setItem('passage', updatedPassage);
  }
}

updatePassage(oldSentence: string, newSentence: string): void {
  const currentPassage = this.passage.value;
  const updatedPassage = currentPassage.map(s => s === oldSentence ? newSentence : s);
  this.passage.next(updatedPassage);
  this.cacheService.setItem('passage', updatedPassage);
}

deletePassage(sentence: string): void {
  const currentPassage = this.passage.value;
  const updatedPassage = currentPassage.filter(s => s !== sentence);
  this.passage.next(updatedPassage);
  this.cacheService.setItem('passage', updatedPassage);
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
    this.cacheService.setItem('wordFamilies', updatedWordFamilies);
  }

  updateWordFamily(id: number, updatedWordFamily: Partial<WordFamily>): void {
    const currentWordFamilies = this.wordFamilies.value;
    const updatedWordFamilies = currentWordFamilies.map(wf =>
      wf.id === id ? { ...wf, ...updatedWordFamily } : wf
    );
    this.wordFamilies.next(updatedWordFamilies);
    this.cacheService.setItem('wordFamilies', updatedWordFamilies);
  }

  deleteWordFamily(id: number): void {
    const currentWordFamilies = this.wordFamilies.value;
    const updatedWordFamilies = currentWordFamilies.filter(wf => wf.id !== id);
    this.wordFamilies.next(updatedWordFamilies);
    this.cacheService.setItem('wordFamilies', updatedWordFamilies);
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
    this.cacheService.setItem('objects', updatedObjects);
  }

  updateObject(id: number, updatedObject: Partial<Object>): void {
    const currentObjects = this.objects.value;
    const updatedObjects = currentObjects.map(obj =>
      obj.id === id ? { ...obj, ...updatedObject } : obj
    );
    this.objects.next(updatedObjects);
    this.cacheService.setItem('objects', updatedObjects);
  }

  deleteObject(id: number): void {
    const currentObjects = this.objects.value;
    const updatedObjects = currentObjects.filter(obj => obj.id !== id);
    this.objects.next(updatedObjects);
    this.cacheService.setItem('objects', updatedObjects);
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
      this.cacheService.setItem('section1', updatedWords);
    }
  }

  updateSection1Word(oldWord: string, newWord: string): void {
    const currentWords = this.section1Array.value;
    const updatedWords = currentWords.map(w => w === oldWord ? newWord : w);
    this.section1Array.next(updatedWords);
    this.cacheService.setItem('section1', updatedWords);
  }

  deleteSection1Word(word: string): void {
    const currentWords = this.section1Array.value;
    const updatedWords = currentWords.filter(w => w !== word);
    this.section1Array.next(updatedWords);
    this.cacheService.setItem('section1', updatedWords);
  }

  // Section 2 CRUD operations
  getsection2Array(): Observable<string[]> {
    return this.section2Array.asObservable();
  }

  addSection3Word(word: string): void {
    const currentWords = this.section2Array.value;
    if (!currentWords.includes(word)) {
      const updatedWords = [...currentWords, word];
      this.section2Array.next(updatedWords);
      this.cacheService.setItem('section2', updatedWords); // Corrected key to 'section2'
    }
  }

  updateSection3Word(oldWord: string, newWord: string): void {
    const currentWords = this.section2Array.value;
    const updatedWords = currentWords.map(w => w === oldWord ? newWord : w);
    this.section2Array.next(updatedWords);
    this.cacheService.setItem('section2', updatedWords); // Corrected key to 'section2'
  }

  deleteSection3Word(word: string): void {
    const currentWords = this.section2Array.value;
    const updatedWords = currentWords.filter(w => w !== word);
    this.section2Array.next(updatedWords);
    this.cacheService.setItem('section2', updatedWords); // Corrected key to 'section2'
  }

  // Words CRUD operations
  getWords(): Observable<Words> {
    return this.words.asObservable();
  }

  updateWords(newWords: Partial<Words>): void {
    const currentWords = this.words.value;
    const updatedWords = { ...currentWords, ...newWords } as Words;
    this.words.next(updatedWords);
    this.cacheService.setItem('words', updatedWords);
  }

  addWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    if (currentWords[category].includes(word)) return; // Prevent duplicates
    const updatedWords = {
      ...currentWords,
      [category]: [...currentWords[category], word]
    };
    this.words.next(updatedWords);
    this.cacheService.setItem('words', updatedWords);
  }

  removeWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    const updatedWords = {
      ...currentWords,
      [category]: currentWords[category].filter(w => w !== word)
    };
    this.words.next(updatedWords);
    this.cacheService.setItem('words', updatedWords);
  }
}
