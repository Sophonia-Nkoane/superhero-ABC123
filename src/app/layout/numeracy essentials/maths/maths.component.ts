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
  name = 'Maths';

  constructor(private voiceService: VoiceService) {}

  playResultAudio(result: string) {
    const selectedVoice = this.voiceService.getSelectedVoice(this.language);
    if (selectedVoice) {
      this.voiceService.playWords([result], this.language);
    } else {
      console.error('No voice selected or available.');
    }
  }

}
