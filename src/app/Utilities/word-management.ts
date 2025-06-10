// Define interface for word families
export interface WordFamily {
  group: 'Vowels' | 'Consonants'; // Define group type for word families
  prefix: string; // Prefix for word family
  words: string[]; // Array of words in the word family
}

// Array of predefined word families
export const WORD_FAMILIES: WordFamily[] = [
  { group: 'Vowels', prefix: 'at', words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat'] },
  { group: 'Vowels', prefix: 'an', words: ['can', 'fan', 'man', 'van', 'tan', 'pan', 'scan', 'plan'] },
  { group: 'Consonants', prefix: 'en', words: ['pen', 'ten', 'hen', 'men', 'den', 'len', 'wen', 'gen'] },
  { group: 'Consonants', prefix: 'in', words: ['pin', 'tin', 'win', 'din', 'kin', 'lin', 'min', 'sin'] },
  { group: 'Vowels', prefix: 'ot', words: ['not', 'hot', 'pot', 'rot', 'tot', 'dot', 'got', 'lot'] },
  { group: 'Vowels', prefix: 'un', words: ['fun', 'run', 'sun', 'bun', 'gun', 'hun', 'mun', 'pun'] },
  { group: 'Consonants', prefix: 'et', words: ['get', 'set', 'vet', 'bet', 'jet', 'let', 'met', 'net'] },
  { group: 'Consonants', prefix: 'it', words: ['sit', 'kit', 'lit', 'mit', 'nit', 'pit', 'rit', 'wit'] },
  { group: 'Consonants', prefix: 'ut', words: ['cut', 'gut', 'hut', 'lut', 'mut', 'nut', 'put', 'rut'] },
  { group: 'Vowels', prefix: 'am', words: ['cam', 'ham', 'jam', 'lam', 'mam', 'ram', 'sam', 'dam'] },
  { group: 'Vowels', prefix: 'em', words: ['gem', 'hem', 'lem', 'mem', 'nem', 'rem', 'sem', 'them'] },
  { group: 'Consonants', prefix: 'im', words: ['him', 'lim', 'rim', 'sim', 'tim', 'vim', 'whim', 'brim'] }
];

// Array of alphabet letters
export const alphabet: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];

// Array of vowels
export const vowels: string[] = ['a', 'e', 'i', 'o', 'u'];


