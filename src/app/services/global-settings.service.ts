import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  private language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  private languageSubject = new BehaviorSubject<'English' | 'Afrikaans' | 'Zulu'>('English');

  setLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.language = language;
    localStorage.setItem('language', language);
    this.languageSubject.next(language);
  }

  getLanguage(): 'English' | 'Afrikaans' | 'Zulu' {
    const savedLanguage = localStorage.getItem('language') as 'English' | 'Afrikaans' | 'Zulu';
    return savedLanguage || this.language;
  }

  // Add method to get language changes as Observable
  onLanguageChange(): Observable<'English' | 'Afrikaans' | 'Zulu'> {
    return this.languageSubject.asObservable();
  }
}
