import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-addition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addition.component.html',
  styleUrls: ['../maths.component.css']
})
export class AdditionComponent implements OnInit {
  problems: { num1: number, num2: number, num3: number, num4: number, num5: number, sum: number }[] = [];
  currentProblem: { num1: number, num2: number, num3: number, num4: number, num5: number, sum: number } | null = null;
  userInputs: { num1: string, num2: string, num3: string, num4: string, num5: string, sum: string } = { num1: '', num2: '', num3: '', num4: '', num5: '', sum: '' };
  attemptCount: number = 0;
  level: number = 1;
  missingPosition: 'num1' | 'num2' | 'num3' | 'num4' | 'num5' | 'sum' = 'sum';
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  voiceEnabled: boolean = true;

  @ViewChildren('inputBlock') inputBlocks: QueryList<ElementRef<HTMLInputElement>> | null = null;

  constructor(private voiceService: VoiceService, private dataService: DataService) {}

  ngOnInit() {
    this.generateProblems();
    this.setNewProblem();
  }

  generateProblems() {
    // Generate a set of addition problems based on the current level
    for (let i = 0; i < 10; i++) {
      let num1, num2, num3, num4, num5;
      if (this.level <= 3) {
        num1 = Math.floor(Math.random() * 11); // 0 to 10
        num2 = Math.floor(Math.random() * 11); // 0 to 10
        num3 = 0;
        num4 = 0;
        num5 = 0;
      } else {
        num1 = Math.floor(Math.random() * 101); // 0 to 100
        num2 = Math.floor(Math.random() * 101); // 0 to 100
        num3 = Math.floor(Math.random() * 101); // 0 to 100
        num4 = Math.floor(Math.random() * 101); // 0 to 100
        num5 = Math.floor(Math.random() * 101); // 0 to 100
      }

      const sum = num1 + num2 + num3 + num4 + num5;

      this.problems.push({ num1, num2, num3, num4, num5, sum });
    }
  }

  setNewProblem() {
    if (this.problems.length > 0) {
      this.currentProblem = this.problems.pop() || null;
      this.clearInputs();
      this.attemptCount = 0;
      this.setMissingPosition();
    } else {
      // All problems solved, generate new ones
      this.generateProblems();
      this.setNewProblem();
    }
  }

  clearInputs() {
    this.userInputs = { num1: '', num2: '', num3: '', num4: '', num5: '', sum: '' };
    if (this.inputBlocks) {
      this.inputBlocks.forEach(inputRef => {
        inputRef.nativeElement.value = '';
      });
    }
  }

  setMissingPosition() {
    if (this.level === 2 || this.level === 3 || this.level === 5 || this.level === 6) {
      const positions: ('num1' | 'num2' | 'num3' | 'num4' | 'num5' | 'sum')[] = ['num1', 'num2', 'num3', 'num4', 'num5', 'sum'];
      this.missingPosition = positions[Math.floor(Math.random() * positions.length)];
    } else {
      // For levels 1 and 4, always hide the sum
      this.missingPosition = 'sum';
    }
  }

  checkAnswer() {
    if (this.currentProblem) {
      let userAnswer: number;
      let correctAnswer: number;

      switch (this.missingPosition) {
        case 'num1':
          userAnswer = parseInt(this.userInputs.num1);
          correctAnswer = this.currentProblem.num1;
          break;
          case 'num2':
            userAnswer = parseInt(this.userInputs.num2);
            correctAnswer = this.currentProblem.num2;
            break;
          case 'num3':
            userAnswer = parseInt(this.userInputs.num3);
            correctAnswer = this.currentProblem.num3;
            break;
          case 'num4':
            userAnswer = parseInt(this.userInputs.num4);
            correctAnswer = this.currentProblem.num4;
            break;
          case 'num5':
            userAnswer = parseInt(this.userInputs.num5);
            correctAnswer = this.currentProblem.num5;
            break;
          case 'sum':
          default:
            userAnswer = parseInt(this.userInputs.sum);
            correctAnswer = this.currentProblem.sum;
            break;
        }

        if (userAnswer === correctAnswer) {
          this.playResultAudio();
          let timeout = 3000;
          if (this.level >= 4) {
            timeout = 6500;
          }
          setTimeout(() => {
            this.clearInputs();
            this.setNewProblem();
          }, timeout);
        } else {
          this.attemptCount++;
          this.userInputs[this.missingPosition] = '';
          if (this.inputBlocks) {
            const inputToReset = this.inputBlocks.find(input => input.nativeElement.id === this.missingPosition);
            if (inputToReset) {
              inputToReset.nativeElement.value = '';
            }
          }
          alert('Incorrect. Try again!');
        }
      }
    }

    playResultAudio() {
      if (!this.voiceEnabled || !this.currentProblem) return;

      let problem: string;
      if (this.level <= 3) {
        problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} equals ${this.currentProblem.sum}`;
      } else {
        problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} plus ${this.currentProblem.num3} plus ${this.currentProblem.num4} plus ${this.currentProblem.num5} equals ${this.currentProblem.sum}`;
      }
      const selectedVoice = this.voiceService.getSelectedVoice(this.language);
      if (selectedVoice) {
        this.voiceService.playWords([problem], this.language);
      } else {
        console.error('No voice selected or available.');
      }
    }

    readProblem() {
      if (!this.voiceEnabled || !this.currentProblem) return;

      let problem: string;
      if (this.level <= 3) {
        switch (this.missingPosition) {
          case 'num1':
            problem = `What number plus ${this.currentProblem.num2} equals ${this.currentProblem.sum}?`;
            break;
          case 'num2':
            problem = `${this.currentProblem.num1} plus what number equals ${this.currentProblem.sum}?`;
            break;
          case 'sum':
          default:
            problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} equals what number?`;
            break;
        }
      } else {
        switch (this.missingPosition) {
          case 'num1':
            problem = `What number plus ${this.currentProblem.num2} plus ${this.currentProblem.num3} plus ${this.currentProblem.num4} plus ${this.currentProblem.num5} equals ${this.currentProblem.sum}?`;
            break;
          case 'num2':
            problem = `${this.currentProblem.num1} plus what number plus ${this.currentProblem.num3} plus ${this.currentProblem.num4} plus ${this.currentProblem.num5} equals ${this.currentProblem.sum}?`;
            break;
          case 'num3':
            problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} plus what number plus ${this.currentProblem.num4} plus ${this.currentProblem.num5} equals ${this.currentProblem.sum}?`;
            break;
          case 'num4':
            problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} plus ${this.currentProblem.num3} plus what number plus ${this.currentProblem.num5} equals ${this.currentProblem.sum}?`;
            break;
          case 'num5':
            problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} plus ${this.currentProblem.num3} plus ${this.currentProblem.num4} plus what number equals ${this.currentProblem.sum}?`;
            break;
          case 'sum':
          default:
            problem = `${this.currentProblem.num1} plus ${this.currentProblem.num2} plus ${this.currentProblem.num3} plus ${this.currentProblem.num4} plus ${this.currentProblem.num5} equals what number?`;
            break;
        }
      }
      const selectedVoice = this.voiceService.getSelectedVoice(this.language);
      if (selectedVoice) {
        this.voiceService.playWords([problem], this.language);
      } else {
        console.error('No voice selected or available.');
      }
    }

    setLevel(newLevel: number) {
      this.level = newLevel;
      this.problems = []; // Clear existing problems
      this.generateProblems(); // Generate new problems for the new level
      this.setNewProblem();
    }

    onInputChange(event: Event, position: 'num1' | 'num2' | 'num3' | 'num4' | 'num5' | 'sum') {
      const input = event.target as HTMLInputElement;
      const value = input.value;

      // Ensure only numbers are entered
      if (!/^\d*$/.test(value)) {
        input.value = value.replace(/[^\d]/g, '');
      }

      // Limit to 2 digits for levels 1, 2, 4, and 5; 3 digits for levels 3 and 6
      const maxLength = this.level === 3 || this.level === 6 ? 3 : 2;
      if (value.length > maxLength) {
        input.value = value.slice(0, maxLength);
      }

      this.userInputs[position] = input.value;

      // Auto-check answer when all inputs are filled
      if (this.allInputsFilled()) {
        this.checkAnswer();
      }
    }

    allInputsFilled(): boolean {
      if (this.level <= 3) {
        return (this.userInputs.num1 !== '' && this.userInputs.num2 !== '' && this.userInputs.sum !== '');
      } else {
        return (this.userInputs.num1 !== '' && this.userInputs.num2 !== '' && this.userInputs.num3 !== '' && this.userInputs.num4 !== '' && this.userInputs.num5 !== '' && this.userInputs.sum !== '');
      }
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
    }
  }
