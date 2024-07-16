import { Routes } from '@angular/router';
import { AlphabetComponent } from './alphabet/alphabet.component';
import { SentenceBuildingComponent } from './sentence-building/sentence-building.component';
import { NumbersComponent } from './numbers/numbers.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { WordFamiliesComponent } from './word-families/word-families.component';
import { DataManagerComponent } from './data-manager/data-manager.component';
import { learningComponent } from './learning/learning.component';


export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // Redirect to welcome page if no route matched
  { path: 'welcome', component: WelcomeComponent },
  { path: 'alphabet', component: AlphabetComponent },
  { path: 'numbers', component: NumbersComponent },
  { path: 'word-families', component: WordFamiliesComponent },
  { path: 'sentence-building', component: SentenceBuildingComponent },
  { path: 'settings', component: SettingsComponent, children: [
    { path: '', component: DataManagerComponent },
  ] },
  { path: 'data-manager', component: DataManagerComponent },
  { path: 'learning', component: learningComponent }
];
