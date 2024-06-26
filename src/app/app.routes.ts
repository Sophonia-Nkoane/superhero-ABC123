import { Routes } from '@angular/router';
import { AlphabetComponent } from './alphabet/alphabet.component';
import { WordFamiliesComponent } from './word-families/word-families.component';
import { SentenceBuildingComponent } from './sentence-building/sentence-building.component';
import { NumbersComponent } from './numbers/numbers.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'alphabet', component: AlphabetComponent },
  { path: 'numbers', component: NumbersComponent },
  { path: 'word-families', component: WordFamiliesComponent },
  { path: 'sentence-building', component: SentenceBuildingComponent }
];
