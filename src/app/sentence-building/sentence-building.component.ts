import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sentence-building',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentence-building.component.html',
  styleUrl: './sentence-building.component.css'
})
export class SentenceBuildingComponent {
  words = {
    beginningWords: [
      "The",
      "A",
      "An",
      "This",
      "That",
      "These",
      "Those",
      "Here",
      "There",
      "Now",
      "Then",
      "I",
      "You",
      "He",
      "She",
      "It",
      "We",
      "They",
      "My",
      "Your",
      "His",
      "Her"
    ],
    functionWords: [
      "a",
      "an",
      "my",
      "your",
      "his",
      "her",
      "like",
      "with",
      "from",
      "in",
      "on",
      "at",
      "by",
      "into",
      "through",
      "under",
      "above",
      "over",
      "across"
    ],
    verbs: [
      "run",
      "jump",
      "play",
      "eat",
      "sleep",
      "read",
      "write",
      "is",
      "are",
      "am",
      "be",
      "have",
      "has"
    ],
    objects: [
      "ball",
      "book",
      "toy",
      "apple",
      "pencil",
      "dog",
      "cat",
      "house",
      "car",
      "tree",
      "puppy",
      "kitty"
    ]
  };
  sentence = '';

  addWordToSentence(words: string[]) {
    this.sentence += words.join(' ') + ' ';
  }

  clearSentence() {
    this.sentence = '';
  }

  undoWord() {
    const words = this.sentence.split(' ');
    if (words.length > 0) {
      this.sentence = words.slice(0, -1).join(' ');
    }
  }

  playGame() {
    const sentenceArray = this.sentence.split(' ');
    const error = this.checkSentenceOrder();
    if (error.index !== -1) {
      console.log(`Incorrect sentence! Expected ${error.type} but got ${sentenceArray[error.index]}`);
      const highlightedSentence = this.sentence.replace(sentenceArray[error.index], `<u>${sentenceArray[error.index]}</u>`);
      console.log(highlightedSentence);
    } else {
      console.log("Correct sentence!");
      // Play the sentence
    }
    return true;
  }

  isValidWord(word: string) {
    const allWords = Object.values(this.words).flat();
    return allWords.includes(word);
  }

  checkSentenceOrder() {
    const words = this.sentence.split(' ');
    const order = [
      'beginningWords',
      'functionWords',
      'verbs',
      'objects',
      'functionWords'
    ];
    let currentOrder = 0;
    let error = { index: -1, type: '' };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!this.words[order[currentOrder] as keyof typeof this.words].includes(word)) {
        error.index = i;
        error.type = order[currentOrder];
        break;
      }
      currentOrder++;
    }

    return error;
  }

  generateAllSentences(): string[] {
    const sentences: string[] = [];
    this.words.beginningWords.forEach((beginningWord) => {
      this.words.functionWords.forEach((functionWord) => {
        this.words.verbs.forEach((verb) => {
          this.words.objects.forEach((object) => {
            let sentence;
            if (beginningWord === "I" || beginningWord === "You" || beginningWord === "We" || beginningWord === "They") {
              sentence = [beginningWord, verb, object];
            } else {
              sentence = [beginningWord, functionWord, verb, object];
            }
            sentences.push(sentence.join(' '));
          });
        });
      });
    });
    return sentences;
  }

  checkUserSentence(sentence: string) {
    const possibleSentences = this.generateAllSentences();
    const userSentence = sentence.split(' ');
    const matchingSentence = possibleSentences.find((possibleSentence) => {
      const possibleSentenceArray = possibleSentence.split(' ');
      return possibleSentenceArray.every((word, index) => word === userSentence[index]);
    });
    return matchingSentence !== undefined;
  }

  onSubmit(sentence: string) {
    const isValid = this.checkUserSentence(sentence);
    if (isValid) {
      alert("Your sentence is grammatically correct!")
    }else {
      alert("Your sentence is not grammatically correct.");
    }
  }
  getWordPartOfSpeech(word: string): string {
    if (this.words.beginningWords.includes(word)) {

      return 'beginningWord';

    } else if (this.words.functionWords.includes(word)) {

      return 'functionWord';

    } else if (this.words.verbs.includes(word)) {

      return 'verb';

    } else if (this.words.objects.includes(word)) {

      return 'object';

    } else {

      return 'unknown';

    }
  }
  checkIncorrectWord(word: string, index: number): boolean {
    const expectedPartOfSpeech = [

      'beginningWord',

      'functionWord',

      'verb',

      'object',

      'functionWord'

    ][index];

    const wordPartOfSpeech = this.getWordPartOfSpeech(word);

    return wordPartOfSpeech !== expectedPartOfSpeech;
  }
}
