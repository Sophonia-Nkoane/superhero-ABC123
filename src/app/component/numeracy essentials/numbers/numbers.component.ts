import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';

@Component({
  selector: 'app-numbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.css']
})
export class NumbersComponent implements OnInit {
  numbers = Array.from({ length: 101 }, (_, i) => i.toString()).slice(0, 100);
  numberInWords = '';
  currentNumber = '';
  isReading = false; // Flag to indicate if the read all process is ongoing
  stopRequested = false; // Flag to indicate if stop was requested
  searchResults: string[] = [];
  increment = '1';
  increments = ['1', '2', '5', '10', '20'];
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  languages = ['English', 'Afrikaans', 'Zulu'] as const;
  isPlaying = false; // New flag to track if sound is currently playing

  @ViewChild('numberInWordsElement', { static: true }) numberInWordsElement!: ElementRef;
  @ViewChild('currentNumberElement', { static: true }) currentNumberElement!: ElementRef;

  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage as 'English' | 'Afrikaans' | 'Zulu';
    }

    // Load the selected voice for the current language
    this.loadSelectedVoice();
  }

  loadSelectedVoice() {
    let selectedVoiceKey = '';
    let langPrefix = '';
    if (this.language === 'English') {
      selectedVoiceKey = 'selectedVoiceEnglish';
      langPrefix = 'en';
    } else if (this.language === 'Afrikaans') {
      selectedVoiceKey = 'selectedVoiceAfrikaans';
      langPrefix = 'af';
    } else if (this.language === 'Zulu') {
      selectedVoiceKey = 'selectedVoiceZulu';
      langPrefix = 'zu';
    }
    const savedVoiceId = localStorage.getItem(selectedVoiceKey);
    if (savedVoiceId) {
      const voice = this.voiceService.getVoices(langPrefix).find(v => this.voiceService.getVoiceId(v) === savedVoiceId);
      if (voice) {
        this.voiceService.setSelectedVoice(voice, this.language);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.isReading) return; // Prevent key press actions during reading
    const number = event.key;
    if (this.isValidNumberKey(number)) {
      this.playNumberAudio(number);
    }
  }

  toggleIncrement(increment: string) {
    if (this.isReading) return; // Prevent changing increments during reading
    this.increment = increment;
  }

  getNumbers() {
    const incrementValue = parseInt(this.increment);
    return Array.from({ length: Math.floor(100 / incrementValue) + 1 }, (_, i) => (i * incrementValue).toString());
  }

  num2words(n: number): string {
    const ones: Record<typeof this.language, string[]> = {
      English: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
      Afrikaans: ['nul', 'een', 'twee', 'drie', 'vier', 'vyf', 'ses', 'sewe', 'agt', 'nege'],
      Zulu: ['iqanda', 'kunye', 'kubili', 'kuthathu', 'kune', 'kuyisihlanu', 'isithupha', 'isikhombisa', 'isishiyagalombili', 'isishiyagalolunye']
    };
    const teens: Record<typeof this.language, string[]> = {
      English: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
      Afrikaans: ['tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vyftien', 'sestien', 'sewentien', 'agtien', 'negentien'],
      Zulu: ['ishumi', 'ishumi nanye', 'ishumi nambili', 'ishumi nantathu', 'ishumi nane', 'ishumi nanhlanu', 'ishumi nesithupha', 'ishumi nesikhombisa', 'ishumi nesishiyagalombili', 'ishumi nesishiyagalolunye']
    };
    const tens: Record<typeof this.language, string[]> = {
      English: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
      Afrikaans: ['', '', 'twintig', 'dertig', 'veertig', 'vyftig', 'sestig', 'sewentig', 'tagtig', 'negentig'],
      Zulu: ['', '', 'amashumi amabili', 'amashumi amathathu', 'amashumi amane', 'amashumi amahlanu', 'amashumi ayisithupha', 'amashumi ayisikhombisa', 'amashumi ayisishiyagalolunye']
    };
    const hundreds: Record<typeof this.language, string[]> = {
      English: ['one hundred'],
      Afrikaans: ['een honderd'],
      Zulu: ['ikhulu']
    };

    if (n < 10) return ones[this.language][n];
    if (n < 20) return teens[this.language][n - 10];
    if (n < 100) return `${tens[this.language][Math.floor(n / 10)]}${n % 10 ? ' ' + ones[this.language][n % 10] : ''}`;
    if (n === 100) return hundreds[this.language][0];

    return 'Not implemented';
  }

  isValidNumberKey(key: string): boolean {
    const num = parseInt(key);
    return !isNaN(num) && num >= 0 && num <= 9;
  }

  async playNumberAudio(number: string) {
    if (this.isPlaying) return; // Prevent playing if already playing

    this.isPlaying = true;
    const num = parseInt(number);
    this.numberInWords = this.num2words(num);
    this.currentNumber = number;
    this.updateNumberInWordsElement();

    const selectedVoice = this.voiceService.getSelectedVoice(this.language);
    if (selectedVoice) {
      try {
        await this.voiceService.playWords([this.numberInWords, number], this.language,
          (word) => {
            if (word === this.numberInWords) {
              this.numberInWordsElement.nativeElement.classList.add('highlight');
            } else if (word === number) {
              this.currentNumberElement.nativeElement.classList.add('highlight');
            }
          },
          (word) => {
            if (word === this.numberInWords) {
              this.numberInWordsElement.nativeElement.classList.remove('highlight');
            } else if (word === number) {
              this.currentNumberElement.nativeElement.classList.remove('highlight');
            }
          }
        );
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        this.isPlaying = false;
      }
    } else {
      console.error('No voice selected or available.');
      this.isPlaying = false;
    }
  }

  updateNumberInWordsElement() {
    const element = this.numberInWordsElement.nativeElement;
    element.textContent = this.numberInWords;
  }

  animateElement(element: HTMLElement, duration: number) {
    return new Promise(resolve => {
      element.classList.add('animate');
      setTimeout(() => {
        element.classList.remove('animate');
        resolve(true);
      }, duration);
    });
  }

  searchNumbers(query: string) {
    query = query.toLowerCase();
    this.searchResults = this.numbers.filter(num => num.includes(query));
    this.updateNumberInWordsElement();
  }

  async onLanguageChange() {
    localStorage.setItem('language', this.language);
    this.loadSelectedVoice();
  }

  async readAllNumbers() {
    if (this.isPlaying || this.isReading) return; // Prevent starting if already playing or reading

    this.isReading = true;
    this.stopRequested = false; // Reset the stop flag
    for (const number of this.getNumbers()) {
      if (this.stopRequested) {
        break;
      }
      await this.playNumberAudio(number);
      if (!this.stopRequested) {
        await this.delay(1000); // Reduced delay between numbers
      }
    }
    this.isReading = false;
  }

  stopReading() {
    this.stopRequested = true;
    this.isReading = false;
    this.isPlaying = false;
  }

  toggleAutoRead() {
    if (this.isReading) {
      this.stopReading();
    } else {
      this.readAllNumbers();
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
