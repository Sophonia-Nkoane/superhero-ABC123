import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrl: './alphabet.component.css'
})
export class AlphabetComponent {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  searchLetter = '';
  selectedLetter = '';
  filteredAlphabet = this.alphabet.split('');

  getAudioSrc(letter: string) {
    return `assets/audio/alphabet/${letter.toUpperCase()}.mp3`;
  }
  playAudio(letter: string) {
    const audio = new Audio(`assets/audio/alphabet/${letter.toUpperCase()}.mp3`);
    audio.play();
    this.searchLetter = `${letter.toUpperCase()}  ${letter.toLowerCase()}`; // Update the searchLetter with both uppercase and lowercase letters
    this.selectedLetter = letter;
  }
  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
  const letter = event.key.toUpperCase();
  if (this.alphabet.includes(letter)) {
    this.playAudio(letter);
    this.searchLetter = `${letter} ${letter.toLowerCase()}`; // Update searchLetter with both uppercase and lowercase
  }
}
  ngDoCheck() {
    this.filteredAlphabet = this.alphabet.split('').filter(letter => letter.includes(this.searchLetter.toUpperCase()));
  }
}
