import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  private language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  private languageChange = new Subject<'English' | 'Afrikaans' | 'Zulu'>();

  setLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.language = language;
    localStorage.setItem('language', language);
    this.languageChange.next(language);
  }

  getLanguage(): 'English' | 'Afrikaans' | 'Zulu' {
    const savedLanguage = localStorage.getItem('language') as 'English' | 'Afrikaans' | 'Zulu';
    return savedLanguage || this.language;
  }

  onLanguageChange() {
    return this.languageChange.asObservable();
  }
}
