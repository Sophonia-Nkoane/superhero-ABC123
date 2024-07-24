import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent {
  num1 = '';
  num2 = '';
  result = '';

  divide() {
    const num1Value = parseInt(this.num1);
    const num2Value = parseInt(this.num2);
    this.result = (num1Value / num2Value).toString();
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
