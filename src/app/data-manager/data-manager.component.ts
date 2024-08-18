import { Component, OnInit } from '@angular/core';
import { DataService, WordFamily, Object as DataObject, Words } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.css']
})
export class DataManagerComponent implements OnInit {
  wordFamilies$: Observable<WordFamily[]> = this.dataService.getWordFamilies();
  objects$: Observable<DataObject[]> = this.dataService.getObjects();
  words$: Observable<Words> = this.dataService.getWords();
  alphabet: string[] = this.dataService.getAlphabet();
  vowels: string[] = this.dataService.getVowels();
  section1Array$: Observable<string[]> = this.dataService.getSection1Array();
  section2Array$: Observable<string[]> = this.dataService.getsection2Array();

  newWordFamily: Partial<WordFamily> = {};
  editWordFamily: WordFamily | null = null;
  newObject: Partial<DataObject> = {};
  editObject: DataObject | null = null;
  newWord: { [key in keyof Words]: string } = { subjects: '', actions: '', objects: '' };

  // New properties for managing sections
  newSection1Word: string = '';
  newSection2Sentence: string = '';
  newSection3Word: string = '';
  editSection1Word: string | null = null;
  editSection2Sentence: string | null = null;
  editSection3Word: string | null = null;
  editSection1WordNew: string = '';
  editSection2SentenceNew: string = '';
  editSection3WordNew: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  resetData() {
    if (confirm('Are you sure you want to reset all data to default values? This action cannot be undone.')) {
      this.dataService.resetToDefaults();
    }
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

  updateWordFamily(id: number, updatedWordFamily: Partial<WordFamily>) {
    this.dataService.updateWordFamily(id, updatedWordFamily);
    this.editWordFamily = null;
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

  updateObject(id: number, updatedObject: Partial<DataObject>) {
    this.dataService.updateObject(id, updatedObject);
    this.editObject = null;
  }

  deleteObject(id: number) {
    this.dataService.deleteObject(id);
  }

  addWord(category: keyof Words) {
    const word = this.newWord[category];
    if (word) {
      this.dataService.addWord(category, word);
      this.newWord[category] = '';
    }
  }

  removeWord(category: keyof Words, word: string) {
    this.dataService.removeWord(category, word);
  }

  // New methods for managing sections
  addSection1Word(word: string) {
    if (word.trim()) {
      this.dataService.addSection1Word(word.trim());
      this.newSection1Word = '';
    }
  }

  updateSection1Word(oldWord: string, newWord: string) {
    if (newWord.trim() && oldWord !== newWord.trim()) {
      this.dataService.updateSection1Word(oldWord, newWord.trim());
      this.editSection1Word = null;
      this.editSection1WordNew = '';
    }
  }

  deleteSection1Word(word: string) {
    this.dataService.deleteSection1Word(word);
  }

  addSection3Word(word: string) {
    if (word.trim()) {
      this.dataService.addSection3Word(word.trim());
      this.newSection3Word = '';
    }
  }

  updateSection3Word(oldWord: string, newWord: string) {
    if (newWord.trim() && oldWord !== newWord.trim()) {
      this.dataService.updateSection3Word(oldWord, newWord.trim());
      this.editSection3Word = null;
      this.editSection3WordNew = '';
    }
  }

  deleteSection3Word(word: string) {
    this.dataService.deleteSection3Word(word);
  }
}
