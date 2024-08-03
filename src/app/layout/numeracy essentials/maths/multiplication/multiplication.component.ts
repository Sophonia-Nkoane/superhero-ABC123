import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiplication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiplication.component.html',
  styleUrls: ['./multiplication.component.css']
})
export class MultiplicationComponent {
  num1 = '';
  num2 = '';
  result = '';

  multiply() {
    const num1Value = parseInt(this.num1);
    const num2Value = parseInt(this.num2);
    this.result = (num1Value * num2Value).toString();
  }

  getBlocks(num: string): number[] {
    return Array(parseInt(num)).fill(1);
  }

  getBlockWidth(index: number): string {
    return `${100 / this.getBlockCount()}%`;
  }

  getBlockCount(): number {
    return 10;
  }
}
