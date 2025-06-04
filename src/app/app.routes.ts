import { Routes } from '@angular/router';
<<<<<<< HEAD
import { AlphabetComponent } from './component/language fundamentals/alphabet/alphabet.component';
import { SentenceBuildingComponent } from './component/language fundamentals/sentence-building/sentence-building.component';
import { NumbersComponent } from './component/numeracy essentials/numbers/numbers.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { SettingsComponent } from './component/settings/settings.component';
import { DataManagerComponent } from './component/data-manager/data-manager.component';
import { SpellingComponent } from './component/language fundamentals/spelling/spelling.component';
import { LearningComponent } from './component/language fundamentals/learning/learning.component';
import { AdditionComponent } from './component/numeracy essentials/maths/addition/addition.component';
import { SubtractionComponent } from './component/numeracy essentials/maths/subtraction/subtraction.component';
import { MultiplicationComponent } from './component/numeracy essentials/maths/multiplication/multiplication.component';
import { DivisionComponent } from './component/numeracy essentials/maths/division/division.component';
import { MathsComponent } from './component/numeracy essentials/maths/maths.component';
import { ReadingComponent } from './component/language fundamentals/reading/reading.component';
=======
import { AlphabetComponent } from './alphabet/alphabet.component';
import { SentenceBuildingComponent } from './sentence-building/sentence-building.component';
import { NumbersComponent } from './numbers/numbers.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { WordFamiliesComponent } from './word-families/word-families.component';
import { DataManagerComponent } from './data-manager/data-manager.component';
import { TestsComponent } from './tests/tests.component';


>>>>>>> d1bf3511a1fe2066d8beb8d43dfcf952e4f965f3

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // Redirect to welcome page if no route matched
  { path: 'welcome', component: WelcomeComponent },
  { path: 'alphabet', component: AlphabetComponent },
  { path: 'numbers', component: NumbersComponent },
  { path: 'sentence-building', component: SentenceBuildingComponent },
<<<<<<< HEAD
  { path: 'settings', component: SettingsComponent},
  { path: 'data-manager', component: DataManagerComponent },
  { path: 'learning', component: LearningComponent },
  { path: 'spelling', component: SpellingComponent },
  { path: 'reading', component: ReadingComponent },
  { path: 'maths', component: MathsComponent, children:
    [
      { path: 'addition', component: AdditionComponent },
      { path: 'subtraction', component: SubtractionComponent },
      { path: 'multiplication', component: MultiplicationComponent },
      { path: 'division', component: DivisionComponent },
    ]
  }
=======
  { path: 'settings', component: SettingsComponent, children: [
    { path: '', component: DataManagerComponent },
  ] },
  { path: 'data-manager', component: DataManagerComponent },
  { path: 'tests', component: TestsComponent }
>>>>>>> d1bf3511a1fe2066d8beb8d43dfcf952e4f965f3
];
