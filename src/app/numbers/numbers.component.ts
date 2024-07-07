import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../voice.service';

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
  searchResults: string[] = [];
  increment = '1';
  increments = ['1', '2', '5', '10', '20'];
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  languages = ['English', 'Afrikaans', 'Zulu'] as const;

  @ViewChild('numberInWordsElement', { static: true }) numberInWordsElement!: ElementRef;
  @ViewChild('currentNumberElement', { static: true }) currentNumberElement!: ElementRef;

  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage as 'English' | 'Afrikaans' | 'Zulu';
    }
    this.voiceService.updateLanguage(this.language);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const number = event.key;
    if (this.isValidNumberKey(number)) {
      this.playNumberAudio(number);
    }
  }

  toggleIncrement(increment: string) {
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
    const num = parseInt(number);
    this.numberInWords = this.num2words(num);
    this.currentNumber = number;
    this.updateNumberInWordsElement();

    this.voiceService.playWords([this.numberInWords, number],
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

    await this.animateElement(this.numberInWordsElement.nativeElement, 1000);
    await this.animateElement(this.currentNumberElement.nativeElement, 1000);
  }

  updateNumberInWordsElement() {
    this.numberInWordsElement.nativeElement.innerText = this.numberInWords;
    this.currentNumberElement.nativeElement.innerText = this.currentNumber;
  }

  animateElement(element: HTMLElement, duration: number) {
    return new Promise<void>(resolve => {
      element.style.transition = `all ${duration}ms`;
      element.style.opacity = '0';
      element.style.transform = 'scale(0.5)';
      element.style.boxShadow = '0 0 0px yellow';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1.2)';
        element.style.boxShadow = '0 0 10px yellow';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          setTimeout(() => {
            element.style.boxShadow = '0 0 0px yellow';
            resolve();
          }, duration);
        }, duration);
      }, 0);
    });
  }

  changeLanguage(language: 'English' | 'Afrikaans' | 'Zulu') {
    this.language = language;
    this.voiceService.updateLanguage(language);
    localStorage.setItem('language', language);
  }

  async readAllNumbers() {
    for (let number of this.getNumbers()) {
      await this.playNumberAudio(number);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}
