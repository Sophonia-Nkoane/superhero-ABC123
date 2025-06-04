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


  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize word families
    const initialWordFamilies: WordFamily[] = [
      { id: 1, group: 'Vowels', prefix: 'at', words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat'] },
      { id: 2, group: 'Vowels', prefix: 'at', words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat'] },
      { id: 3, group: 'Vowels', prefix: 'an', words: ['can', 'fan', 'man', 'van', 'tan', 'pan', 'scan', 'plan'] },
      { id: 4, group: 'Consonants', prefix: 'in', words: ['pin', 'tin', 'win', 'din', 'kin', 'lin', 'min', 'sin'] },
      { id: 5, group: 'Consonants', prefix: 'en', words: ['pen', 'ten', 'hen', 'men', 'den', 'len', 'wen', 'gen'] },
      { id: 6, group: 'Vowels', prefix: 'ot', words: ['not', 'hot', 'pot', 'rot', 'tot', 'dot', 'got', 'lot'] },
      { id: 7, group: 'Vowels', prefix: 'un', words: ['fun', 'run', 'sun', 'bun', 'gun', 'hun', 'mun', 'pun'] },
      { id: 8, group: 'Consonants', prefix: 'et', words: ['get', 'set', 'vet', 'bet', 'jet', 'let', 'met', 'net'] },
      { id: 9, group: 'Consonants', prefix: 'it', words: ['sit', 'kit', 'lit', 'mit', 'nit', 'pit', 'rit', 'wit'] },
      { id: 10, group: 'Consonants', prefix: 'ut', words: ['cut', 'gut', 'hut', 'lut', 'mut', 'nut', 'put', 'rut'] },
      { id: 11, group: 'Vowels', prefix: 'am', words: ['cam', 'ham', 'jam', 'lam', 'mam', 'ram', 'sam', 'dam'] },
      { id: 12, group: 'Vowels', prefix: 'em', words: ['gem', 'hem', 'lem', 'mem', 'nem', 'rem', 'sem', 'them'] },
      { id: 13, group: 'Consonants', prefix: 'im', words: ['him', 'lim', 'rim', 'sim', 'tim', 'vim', 'whim', 'brim'] }
    ];

    this.wordFamilies.next(initialWordFamilies);

    // Initialize objects
    const initialObjects: Object[] = [
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
    this.objects.next(initialObjects);

    const initialWords: Words = {
      subjects: ["I", "The boy", "The girl", "He", "She", "It", "The dog", "The cat", "We", "They"],
      actions: ["Eat", "Play", "Run", "Jump", "Read", "Write", "Draw", "Paint", "Sing", "Dance"],
      objects: ["Apples", "Ball", "Book", "Toy", "Game", "Pencil", "Paper", "Crayon", "Paintbrush", "Guitar"]
    };
    this.words.next(initialWords);
  }

  // Word Families CRUD operations
  getWordFamilies(): Observable<WordFamily[]> {
    return this.wordFamilies.asObservable();
  }

  addWordFamily(wordFamily: Omit<WordFamily, 'id'>): void {
    const currentWordFamilies = this.wordFamilies.value;
    const newId = currentWordFamilies.length > 0 ? Math.max(...currentWordFamilies.map(wf => wf.id)) + 1 : 1;
    this.wordFamilies.next([...currentWordFamilies, { ...wordFamily, id: newId }]);
  }

  updateWordFamily(id: number, updatedWordFamily: Partial<WordFamily>): void {
    const currentWordFamilies = this.wordFamilies.value;
    const updatedWordFamilies = currentWordFamilies.map(wf =>
      wf.id === id ? { ...wf, ...updatedWordFamily } : wf
    );
    this.wordFamilies.next(updatedWordFamilies);
  }

  deleteWordFamily(id: number): void {
    const currentWordFamilies = this.wordFamilies.value;
    this.wordFamilies.next(currentWordFamilies.filter(wf => wf.id !== id));
  }

  // Objects CRUD operations
  getObjects(): Observable<Object[]> {
    return this.objects.asObservable();
  }

  addObject(object: Omit<Object, 'id'>): void {
    const currentObjects = this.objects.value;
    const newId = currentObjects.length > 0 ? Math.max(...currentObjects.map(obj => obj.id)) + 1 : 1;
    this.objects.next([...currentObjects, { ...object, id: newId }]);
  }

  updateObject(id: number, updatedObject: Partial<Object>): void {
    const currentObjects = this.objects.value;
    const updatedObjects = currentObjects.map(obj =>
      obj.id === id ? { ...obj, ...updatedObject } : obj
    );
    this.objects.next(updatedObjects);
  }

  deleteObject(id: number): void {
    const currentObjects = this.objects.value;
    this.objects.next(currentObjects.filter(obj => obj.id !== id));
  }

  // Methods for alphabet and vowels
  getAlphabet(): string[] {
    return this.alphabet;
  }

  getVowels(): string[] {
    return this.vowels;
  }

  // Words CRUD operations
  getWords(): Observable<Words> {
    return this.words.asObservable();
  }

  updateWords(newWords: Partial<Words>): void {
      const currentWords = this.words.value;
      const updatedWords = { ...currentWords, ...newWords } as Words;
      this.words.next(updatedWords);
  }

  addWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    if (currentWords[category].includes(word)) return; // Prevent duplicates
    this.words.next({
      ...currentWords,
      [category]: [...currentWords[category], word]
    });
  }

  removeWord(category: keyof Words, word: string): void {
    const currentWords = this.words.value;
    this.words.next({
      ...currentWords,
      [category]: currentWords[category].filter(w => w !== word)
    });
  }
}
