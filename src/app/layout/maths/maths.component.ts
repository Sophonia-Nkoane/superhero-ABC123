import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdditionComponent } from './addition/addition.component';
import { SubtractionComponent } from './subtraction/subtraction.component';
import { MultiplicationComponent } from './multiplication/multiplication.component';
import { DivisionComponent } from './division/division.component';
import { VoiceService } from '../../services/voice.service';

@Component({
  selector: 'app-maths',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdditionComponent,
    SubtractionComponent,
    MultiplicationComponent,
    DivisionComponent
  ],
  templateUrl: './maths.component.html',
  styleUrls: ['./maths.component.css']
})
export class MathsComponent {
  language: 'English' | 'Afrikaans' | 'Zulu' = 'English';

  constructor(private voiceService: VoiceService) {}

  playResultAudio(result: string) {
    const selectedVoice = this.voiceService.getSelectedVoice(this.language);
    if (selectedVoice) {
      this.voiceService.playWords([result], this.language);
    } else {
      console.error('No voice selected or available.');
    }
  }

  readProblem(operation: string, num1: string, num2: string, result: string) {
    let problem = '';
    switch (operation) {
      case 'addition':
        problem = `${num1} plus ${num2} equals ${result}`;
        break;
      case 'subtraction':
        problem = `${num1} minus ${num2} equals ${result}`;
        break;
      case 'multiplication':
        problem = `${num1} times ${num2} equals ${result}`;
        break;
      case 'division':
        problem = `${num1} divided by ${num2} equals ${result}`;
        break;
    }

    const selectedVoice = this.voiceService.getSelectedVoice(this.language);
    if (selectedVoice) {
      this.voiceService.playWords([problem], this.language);
    } else {
      console.error('No voice selected or available.');
    }
  }
}
