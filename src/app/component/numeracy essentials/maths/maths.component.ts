import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubtractionComponent } from './subtraction/subtraction.component';
import { MultiplicationComponent } from './multiplication/multiplication.component';
import { DivisionComponent } from './division/division.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdditionComponent } from './addition/addition.component';

@Component({
  selector: 'app-maths',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdditionComponent,
    SubtractionComponent,
    MultiplicationComponent,
    DivisionComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './maths.component.html',
  styleUrls: ['./maths.component.css']
})
export class MathsComponent {

}
