import { Routes } from '@angular/router';
import { AlphabetComponent } from './layout/alphabet/alphabet.component';
import { SentenceBuildingComponent } from './layout/sentence-building/sentence-building.component';
import { NumbersComponent } from './layout/numbers/numbers.component';
import { WelcomeComponent } from './layout/welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { DataManagerComponent } from './data-manager/data-manager.component';
import { SpellingComponent } from './layout/spelling/spelling.component';
import { MathsComponent } from './layout/maths/maths.component';


export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // Redirect to welcome page if no route matched
  { path: 'welcome', component: WelcomeComponent },
  { path: 'alphabet', component: AlphabetComponent },
  { path: 'numbers', component: NumbersComponent },
  { path: 'sentence-building', component: SentenceBuildingComponent },
  { path: 'settings', component: SettingsComponent, children: [
    { path: '', component: DataManagerComponent },
  ] },
  { path: 'data-manager', component: DataManagerComponent },
  { path: 'spelling', component: SpellingComponent },
  { path: 'maths', component: MathsComponent }
];
