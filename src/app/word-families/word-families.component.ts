import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-word-families',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-families.component.html',
  styleUrl: './word-families.component.css'
})
export class WordFamiliesComponent {
  wordFamilies = [
    {
      group: 'Vowels',
      prefix: 'at',
      words: ['cat', 'hat', 'mat', 'rat', 'sat', 'flat', 'chat', 'spat']
    },
    {
      group: 'Vowels',
      prefix: 'an',
      words: ['can', 'fan', 'man', 'van', 'tan', 'pan', 'scan', 'plan']
    },
    {
      group: 'Consonants',
      prefix: 'in',
      words: ['pin', 'tin', 'win', 'din', 'kin', 'lin', 'min', 'sin']
    },
    {
      group: 'Consonants',
      prefix: 'en',
      words: ['pen', 'ten', 'hen', 'men', 'den', 'len', 'wen', 'gen']
    },
    {
      group: 'Vowels',
      prefix: 'ot',
      words: ['not', 'hot', 'pot', 'rot', 'tot', 'dot', 'got', 'lot']
    },
    {
      group: 'Vowels',
      prefix: 'un',
      words: ['fun', 'run', 'sun', 'bun', 'gun', 'hun', 'mun', 'pun']
    },
    {
      group: 'Consonants',
      prefix: 'et',
      words: ['get', 'set', 'vet', 'bet', 'jet', 'let', 'met', 'net']
    },
    {
      group: 'Consonants',
      prefix: 'it',
      words: ['sit', 'kit', 'lit', 'mit', 'nit', 'pit', 'rit', 'wit']
    },
    {
      group: 'Consonants',
      prefix: 'ut',
      words: ['cut', 'gut', 'hut', 'lut', 'mut', 'nut', 'put', 'rut']
    },
    {
      group: 'Vowels',
      prefix: 'am',
      words: ['cam', 'ham', 'jam', 'lam', 'mam', 'ram', 'sam', 'dam']
    },
    {
      group: 'Vowels',
      prefix: 'em',
      words: ['gem', 'hem', 'lem', 'mem', 'nem', 'rem', 'sem', 'them']
    },
    {
      group: 'Consonants',
      prefix: 'im',
      words: ['him', 'lim', 'rim', 'sim', 'tim', 'vim', 'whim', 'brim']
    }
  ];
  alphabet = ['a', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
  startingLetter = this.getRandomLetter();
  selectedWordFamily: { prefix: string; words: string[] } = { prefix: '', words: [] };
  isCorrect = false;
  answered = false;

  constructor() { }

  getRandomLetter(): string {
    const currentGroup = this.wordFamilies.find(wf => wf.prefix === this.selectedWordFamily?.prefix)?.group;
    const groupLetters = this.alphabet.filter(letter => currentGroup === 'Vowels' ? 'aeiou'.includes(letter) : 'bcdfghjklmnpqrstvwxyz'.includes(letter));
    const randomIndex = Math.floor(Math.random() * groupLetters.length);
    return groupLetters[randomIndex];
  }

  completeWord(prefix: string) {
    this.answered = true;
    const selectedWordFamily = this.wordFamilies.find(wf => wf.prefix === prefix);
    if (selectedWordFamily) {
      this.selectedWordFamily = selectedWordFamily;
      const completeWord = this.startingLetter + prefix;
      const correctAnswer = selectedWordFamily.words.includes(completeWord);
      if (correctAnswer) {
        this.isCorrect = true;
      } else {
        this.isCorrect = false;
      }
    }
  }

  nextLetter() {
    const confirmMoveOn = confirm('Correct! Move on to the next letter?');
    if (confirmMoveOn) {
      const currentLetterIndex = this.alphabet.indexOf(this.startingLetter);
      const nextLetterIndex = (currentLetterIndex + 1) % this.alphabet.length;
      this.startingLetter = this.alphabet[nextLetterIndex];
      this.selectedWordFamily = { prefix: '', words: [] };
      this.isCorrect = false;
      this.answered = false;
    }
  }
}

