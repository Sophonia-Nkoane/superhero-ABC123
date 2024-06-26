import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sentence-building',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-building.component.html',
  styleUrl: './sentence-building.component.css'
})
export class SentenceBuildingComponent {
  words = {
    beginningWords: [
      "The", "A", "An", "This", "That", "These", "Those", "Here", "There", "Now", "Then",
      "I", "You", "He", "She", "It", "We", "They", "My", "Your", "His", "Her"
    ],
    functionWords: [
      "a", "an", "my", "your", "his", "her", "like", "with", "from", "in", "on", "at",
      "by", "into", "through", "under", "above", "over", "across"
    ],
    verbs: [
      "run", "jump", "play", "eat", "sleep", "read", "write", "is", "are", "am", "be", "have", "has"
    ],
    objects: [
      "ball", "book", "toy", "apple", "pencil", "dog", "cat", "house", "car", "tree", "puppy", "kitty"
    ]
  };

  sentenceWords: string[] = [];
  showHits: boolean = false;

  get sentence(): string {
    return this.sentenceWords.join(' ');
  }

  addWordToSentence(words: string[]): void {
    this.sentenceWords.push(...words);
  }

  clearSentence(): void {
    this.sentenceWords = [];
  }

  undo(): void {
    if (this.sentenceWords.length > 0) {
      this.sentenceWords.pop();
    }
  }

  playSentence(): boolean {
    return this.checkSentenceOrder().index === -1;
  }

  isValidWord(word: string): boolean {
    return Object.values(this.words).flat().includes(word);
  }

  checkSentenceOrder(): { index: number, type: string } {
    const order = ['beginningWords', 'functionWords', 'verbs', 'objects', 'functionWords'];
    for (let i = 0; i < this.sentenceWords.length; i++) {
      const word = this.sentenceWords[i];
      const wordType = order[i];
      if (!this.words[wordType as keyof typeof this.words].includes(word)) {
        return { index: i, type: wordType };
      }
    }
    return { index: -1, type: '' };
  }

  generateAllSentences(): string[] {
    const sentences: string[] = [];
    const { beginningWords, functionWords, verbs, objects } = this.words;

    for (const beginningWord of beginningWords) {
      for (const functionWord of functionWords) {
        for (const verb of verbs) {
          for (const object of objects) {
            const sentence = (["I", "You", "We", "They"].includes(beginningWord))
              ? [beginningWord, verb, object]
              : [beginningWord, functionWord, verb, object];
            sentences.push(sentence.join(' '));
          }
        }
      }
    }
    return sentences;
  }

  checkUserSentence(sentence: string): boolean {
    const possibleSentences = this.generateAllSentences();
    return possibleSentences.includes(sentence);
  }

  checkIncorrectWord(word: string, index: number): boolean {
    const expectedPartOfSpeech = ['beginningWord', 'functionWord', 'verb', 'object', 'functionWord'][index];
    return this.getWordPartOfSpeech(word) !== expectedPartOfSpeech;
  }

  getWordPartOfSpeech(word: string): string {
    if (this.words.beginningWords.includes(word)) return 'beginningWord';
    if (this.words.functionWords.includes(word)) return 'functionWord';
    if (this.words.verbs.includes(word)) return 'verb';
    if (this.words.objects.includes(word)) return 'object';
    return 'unknown';
  }
}
