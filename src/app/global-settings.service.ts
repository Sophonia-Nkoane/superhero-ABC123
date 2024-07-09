// global-settings.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  private language: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  setLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.language = language;
    localStorage.setItem('language', language);
  }

  getLanguage(): 'English' | 'Afrikaans' | 'Zulu' {
    const savedLanguage = localStorage.getItem('language') as 'English' | 'Afrikaans' | 'Zulu';
    return savedLanguage || this.language;
  }
}
