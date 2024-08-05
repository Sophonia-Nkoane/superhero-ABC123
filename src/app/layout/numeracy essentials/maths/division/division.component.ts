import { Component, OnInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../../services/voice.service';
import { DataService } from '../../../../services/data.service';
import { Subject } from 'rxjs';

interface Problem {
  dividend: number;
  divisor: number;
  quotient: number;
  missingIndex: number; // 0 for dividend, 1 for divisor, 2 for quotient
}

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division.component.html',
  styleUrls: ['../maths.component.css']
})
export class DivisionComponent implements OnInit, OnDestroy {
  problems: Problem[] = [];
  userInputs: { [key: string]: string } = {};
  level: number = 1;
  subLevel: number = 0;
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  voiceEnabled: boolean = true;
  errorMessage: string = '';
  private unsubscribe$ = new Subject<void>();
  isReading: boolean = false;

  @ViewChildren('inputBlock') inputBlocks: QueryList<ElementRef<HTMLInputElement>> | null = null;

  constructor(private voiceService: VoiceService, private dataService: DataService) {}

  ngOnInit() {
    this.generateProblems();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  generateProblems() {
    const newProblems: Problem[] = [];
    try {
      if (this.level === 1) {
        for (let i = 1; i <= 12; i++) {
          const dividend = i;
          const divisor = 1;
          const quotient = i;
          const missingIndex = 2; // Always make the quotient the answer

          newProblems.push({ dividend, divisor, quotient, missingIndex });
        }
      } else {
        // Generate problems for levels 2 and above (randomized)
        for (let i = 0; i < 13; i++) {
          let dividend, divisor, missingIndex;

          // Generate random dividend and divisor
          dividend = this.generateRandomNumber(1, 100);
          divisor = this.generateRandomNumber(1, 10);

          // Calculate quotient
          const quotient = Math.floor(dividend / divisor);

          // Randomly select missing index (dividend, divisor, or quotient)
          missingIndex = Math.floor(Math.random() * 3);

          newProblems.push({ dividend, divisor, quotient, missingIndex });
        }
      }
      this.problems = newProblems;
      console.log('Generated problems:', this.problems);

      // Auto-read the first problem
      setTimeout(() => this.readProblem(0), 500);
    } catch (error) {
      this.handleError('Error generating problems', error);
    }
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onInputChange(event: Event, problemIndex: number, position: string) {
    const target = event.target as HTMLInputElement;
    this.userInputs[problemIndex + '_' + position] = target.value;
    this.errorMessage = ''; // Clear error message when user starts typing

    // Ensure the input doesn't exceed the maximum allowed length
    const maxLength = this.getMaxLength(problemIndex, position);
    if (target.value.length > maxLength) {
      target.value = target.value.slice(0, maxLength);
      this.userInputs[problemIndex + '_' + position] = target.value;
    }

    this.checkAnswer(problemIndex, position);
  }

  checkAnswer(problemIndex: number, position: string) {
    const currentProblem = this.problems[problemIndex];
    const userAnswer = parseInt(this.userInputs[problemIndex + '_' + position]);
    let correctAnswer;

    if (position === 'dividend') {
      correctAnswer = currentProblem.dividend;
    } else if (position === 'divisor') {
      correctAnswer = currentProblem.divisor;
    } else {
      correctAnswer = currentProblem.quotient;
    }

    const inputBlock = document.getElementById(`input_${problemIndex}_${position}`) as HTMLInputElement;

    if (isNaN(userAnswer)) {
      this.errorMessage = 'Invalid input';
      inputBlock.style.backgroundColor = 'red';
      return;
    }

    if (userAnswer === correctAnswer) {
      this.errorMessage = ''; // Clear error message on correct answer
      inputBlock.style.backgroundColor = 'green';

      // Move to the next problem after a short delay
      setTimeout(() => {
        if (problemIndex < this.problems.length - 1) {
          const nextProblem = this.problems[problemIndex + 1];
          const nextInputId = `input_${problemIndex + 1}_${nextProblem.missingIndex === 0 ? 'dividend' : nextProblem.missingIndex === 1 ? 'divisor' : 'quotient'}`;
          const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            this.readProblem(problemIndex + 1); // Read the next problem
          }
        }
      }, 1000); // Adjust delay as needed
    } else {
        this.errorMessage = 'Incorrect. Try again!';
        inputBlock.style.backgroundColor = 'red';
        this.readProblem(problemIndex); // Re-read the current problem
      }
    }

    async readProblem(problemIndex: number) {
      if (!this.voiceEnabled) return;

      this.isReading = true; // Set the reading flag to true
      try {
        const problem = this.problems[problemIndex];
        const problemText = this.formatProblemForSpeech(problem);
        const selectedVoice = this.voiceService.getSelectedVoice(this.language);
        if (selectedVoice) {
          await this.voiceService.playWords([problemText], this.language);
        } else {
          throw new Error('No voice selected or available.');
        }
      } catch (error) {
        this.handleError('Error playing audio', error);
      } finally {
        this.isReading = false; // Reset the reading flag once done
      }
    }

    private formatProblemForSpeech(problem: Problem): string {
      if (problem.missingIndex === 0) {
        return `What is ${problem.divisor} times what number equals ${problem.dividend}?`;
      } else if (problem.missingIndex === 1) {
        return `What is ${problem.dividend} divided by what number equals ${problem.quotient}?`;
      } else {
        return `What is ${problem.dividend} divided by ${problem.divisor}?`;
      }
    }

    numberOnly(event: KeyboardEvent): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }

    getMaxLength(problemIndex: number, block: string): number {
      const currentProblem = this.problems[problemIndex];
      if (block === 'dividend') {
        return currentProblem.dividend.toString().length;
      } else if (block === 'divisor') {
        return currentProblem.divisor.toString().length;
      } else {
        return currentProblem.quotient.toString().length;
      }
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
    }

    setLevel(level: number) {
      if (this.level !== level && !this.isReading) { // Disable level change if a problem is being read
        this.level = level;
        this.clearInputsAndStyles();
        setTimeout(() => {
          this.generateProblems();
        }, 2000); // Short delay before generating new problems
      }
    }

    setSubLevel(subLevel: number) {
      this.subLevel = subLevel;
      this.clearInputsAndStyles();
      setTimeout(() => {
        this.generateProblems();
      }, 2000); // Short delay before generating new problems
    }

    private clearInputsAndStyles() {
      this.userInputs = {};
      this.problems = []; // Clear existing problems immediately
      const inputFields = document.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
      inputFields.forEach(input => {
        input.style.backgroundColor = '';
        input.value = '';
      });
    }

    private handleError(message: string, error?: any) {
      console.error(message, error);
      this.errorMessage = `${message}: ${error?.message || error}`;
    }
  }
