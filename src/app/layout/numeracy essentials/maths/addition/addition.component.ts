import { Component, OnInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { DataService } from '../../../services/data.service';
import { Subject } from 'rxjs';

interface Problem {
  numbers: number[];
  sum: number;
  missingIndex: number;
}

@Component({
  selector: 'app-addition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addition.component.html',
  styleUrls: ['../maths.component.css']
})
export class AdditionComponent implements OnInit, OnDestroy {
  problems: Problem[] = [];
  userInputs: { [key: string]: string } = {};
  level: number = 1;
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';
  voiceEnabled: boolean = true;
  errorMessage: string = '';
  private unsubscribe$ = new Subject<void>();
  isReading: boolean = false; // New property to track if a problem is being read

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
      for (let i = 0; i < 10; i++) {
        let numbers: number[];
        let missingIndex: number;

        if (this.level === 1) {
          numbers = this.generateNumbersForLowerLevels();
          missingIndex = numbers.length; // sum is always missing for level 1
        } else if (this.level === 2 || this.level === 3) {
          numbers = this.level === 2 ? this.generateNumbersForLowerLevels() : this.generateNumbersForLevelThree();
          missingIndex = Math.floor(Math.random() * (numbers.length + 1)); // randomly select missing index, including sum
        } else if (this.level === 4) {
          numbers = this.generateNumbersForHigherLevels();
          missingIndex = numbers.length; // sum is always missing for level 4
        } else { // level 5
          numbers = this.generateNumbersForHigherLevels();
          missingIndex = Math.floor(Math.random() * (numbers.length + 1)); // randomly select missing index, including sum
        }

        const sum = numbers.reduce((acc, curr) => acc + curr, 0);
        newProblems.push({ numbers, sum, missingIndex });
      }
      this.problems = newProblems;
      console.log('Generated problems:', this.problems);

      // Auto-read the first problem
      setTimeout(() => this.readProblem(0), 500);
    } catch (error) {
      this.handleError('Error generating problems', error);
    }
  }

  private generateNumbersForLowerLevels(): number[] {
    let num1, num2;
    do {
      num1 = this.generateRandomNumber(0, 10);
      num2 = this.generateRandomNumber(0, 10);
    } while (num1 + num2 > 20);
    return [num1, num2];
  }

  private generateNumbersForLevelThree(): number[] {
    let num1, num2;
    do {
      num1 = this.generateRandomNumber(0, 100);
      num2 = this.generateRandomNumber(0, 100);
    } while (num1 + num2 >= 101);
    return [num1, num2];
  }

  private generateNumbersForHigherLevels(): number[] {
    let numbers: number[];
    do {
      numbers = Array.from({ length: 5 }, () => this.generateRandomNumber(0, 100));
    } while (numbers.reduce((acc, curr) => acc + curr, 0) > 200);
    return numbers;
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
    const correctAnswer = position === 'sum'
      ? currentProblem.sum
      : currentProblem.numbers[parseInt(position.slice(3)) - 1];

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
          const nextInputId = `input_${problemIndex + 1}_${nextProblem.missingIndex === nextProblem.numbers.length ? 'sum' : 'num' + (nextProblem.missingIndex + 1)}`;
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
    const { numbers, sum, missingIndex } = problem;
    if (missingIndex === numbers.length) {
      return `${numbers.join(' plus ')} equals what?`;
    } else {
      const questionParts: (number | string)[] = [...numbers];
      questionParts[missingIndex] = 'what number';
      return `${questionParts.join(' plus ')} equals ${sum}`;
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
    if (block === 'sum') {
      return currentProblem.sum.toString().length;
    } else {
      const index = parseInt(block.slice(3)) - 1;
      return currentProblem.numbers[index].toString().length;
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

  getBlocks(problemIndex: number): string[] {
    const currentProblem = this.problems[problemIndex];
    return [...currentProblem.numbers.map((_, index) => 'num' + (index + 1)), 'sum'];
  }

  isInputBlock(problemIndex: number, blockIndex: number): boolean {
    return this.problems[problemIndex].missingIndex === blockIndex;
  }

  getBlockValue(problemIndex: number, blockIndex: number): number {
    const problem = this.problems[problemIndex];
    return blockIndex === problem.numbers.length ? problem.sum : problem.numbers[blockIndex];
  }
}
