import { Component, OnInit } from '@angular/core';
import { DataService, WordFamily, Object as DataObject, Words } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Data Manager</h1>

      <section>
        <h2>Word Families</h2>
        <ul>
          <li *ngFor="let family of wordFamilies">
            {{ family.group }} - {{ family.prefix }}: {{ family.words.join(', ') }}
            <button (click)="deleteWordFamily(family.id)">Delete</button>
          </li>
        </ul>
        <form (ngSubmit)="addWordFamily()">
          <input [(ngModel)]="newWordFamily.group" name="group" placeholder="Group">
          <input [(ngModel)]="newWordFamily.prefix" name="prefix" placeholder="Prefix">
          <input [(ngModel)]="newWordFamily.words" name="words" placeholder="Words (comma-separated)">
          <button type="submit">Add Word Family</button>
        </form>
      </section>

      <section>
        <h2>Objects</h2>
        <ul>
          <li *ngFor="let obj of objects">
            {{ obj.letter }}: {{ obj.object }} {{ obj.icon }}
            <button (click)="deleteObject(obj.id)">Delete</button>
          </li>
        </ul>
        <form (ngSubmit)="addObject()">
          <input [(ngModel)]="newObject.letter" name="letter" placeholder="Letter">
          <input [(ngModel)]="newObject.object" name="object" placeholder="Object">
          <input [(ngModel)]="newObject.icon" name="icon" placeholder="Icon">
          <button type="submit">Add Object</button>
        </form>
      </section>

      <section>
        <h2>Words</h2>
        <div *ngFor="let category of ['subjects', 'actions', 'objects']">
          <h3>{{ category | titlecase }}</h3>
          <ul>
            <li *ngFor="let word of words[category]">
              {{ word }}
              <button (click)="removeWord(category, word)">Remove</button>
            </li>
          </ul>
          <form (ngSubmit)="addWord(category, newWord[category])">
            <input [(ngModel)]="newWord[category]" [name]="category" [placeholder]="'New ' + category">
            <button type="submit">Add {{ category | titlecase }}</button>
          </form>
        </div>
      </section>

      <section>
        <h2>Alphabet</h2>
        <p>{{ alphabet.join(', ') }}</p>
      </section>

      <section>
        <h2>Vowels</h2>
        <p>{{ vowels.join(', ') }}</p>
      </section>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    section { margin-bottom: 30px; }
    ul { list-style-type: none; padding: 0; }
    li { margin-bottom: 10px; }
    form { margin-top: 10px; }
    input { margin-right: 10px; }
  `]
})
export class DataManagerComponent implements OnInit {
  wordFamilies: WordFamily[] = [];
  objects: DataObject[] = [];
  words: Words = { subjects: [], actions: [], objects: [] };
  alphabet: string[] = [];
  vowels: string[] = [];

  newWordFamily: Partial<WordFamily> = {};
  newObject: Partial<DataObject> = {};
  newWord: { [key in keyof Words]: string } = { subjects: '', actions: '', objects: '' };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getWordFamilies().subscribe(families => this.wordFamilies = families);
    this.dataService.getObjects().subscribe(objects => this.objects = objects);
    this.dataService.getWords().subscribe(words => this.words = words);
    this.alphabet = this.dataService.getAlphabet();
    this.vowels = this.dataService.getVowels();
  }

  addWordFamily() {
    if (this.newWordFamily.group && this.newWordFamily.prefix && this.newWordFamily.words) {
      this.dataService.addWordFamily({
        group: this.newWordFamily.group as 'Vowels' | 'Consonants',
        prefix: this.newWordFamily.prefix,
        words: (this.newWordFamily.words as unknown as string).split(',').map(word => word.trim())
      });
      this.newWordFamily = {};
    }
  }

  deleteWordFamily(id: number) {
    this.dataService.deleteWordFamily(id);
  }

  addObject() {
    if (this.newObject.letter && this.newObject.object && this.newObject.icon) {
      this.dataService.addObject(this.newObject as DataObject);
      this.newObject = {};
    }
  }

  deleteObject(id: number) {
    this.dataService.deleteObject(id);
  }

  addWord(category: keyof Words, word: string) {
    if (word) {
      this.dataService.addWord(category, word);
      this.newWord[category] = '';
    }
  }

  removeWord(category: keyof Words, word: string) {
    this.dataService.removeWord(category, word);
  }
}
