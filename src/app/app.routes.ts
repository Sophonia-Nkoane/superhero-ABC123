import { Routes } from '@angular/router';
import { AlphabetComponent } from './layout/language fundamentals/alphabet/alphabet.component';
import { SentenceBuildingComponent } from './layout/language fundamentals/sentence-building/sentence-building.component';
import { NumbersComponent } from './layout/numeracy essentials/numbers/numbers.component';
import { WelcomeComponent } from './layout/welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { DataManagerComponent } from './data-manager/data-manager.component';
import { SpellingComponent } from './layout/language fundamentals/spelling/spelling.component';
import { MathsComponent } from './layout/numeracy essentials/maths/maths.component';
import { SubtractionComponent } from './layout/numeracy essentials/maths/subtraction/subtraction.component';
import { AdditionComponent } from './layout/numeracy essentials/maths/addition/addition.component';
import { MultiplicationComponent } from './layout/numeracy essentials/maths/multiplication/multiplication.component';
import { DivisionComponent } from './layout/numeracy essentials/maths/division/division.component';
import { WordFamiliesComponent } from './layout/word-families/word-families.component';
import { LearningComponent } from './layout/learning/learning.component';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // Redirect to welcome page if no route matched
  { path: 'welcome', component: WelcomeComponent },
  { path: 'alphabet', component: AlphabetComponent },
  { path: 'numbers', component: NumbersComponent },
  { path: 'word-families', component: WordFamiliesComponent },
  { path: 'sentence-building', component: SentenceBuildingComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'data-manager', component: DataManagerComponent },
  { path: 'learning', component: LearningComponent },
  { path: 'spelling', component: SpellingComponent },
  {
    path: 'maths', component: MathsComponent, children: [
      { path: 'addition', component: AdditionComponent },
      { path: 'subtraction', component: SubtractionComponent },
      { path: 'multiplication', component: MultiplicationComponent },
      { path: 'division', component: DivisionComponent },
    ]
  }
];
