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
  // Properties
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // List of all alphabet letters
  searchLetter = ''; // Holds the current search query for letters
  selectedLetter = ''; // Stores the last selected letter
  filteredAlphabet: string[] = []; // Array to hold filtered alphabet letters

  // Lifecycle hook to initialize component
  ngOnInit() {
    this.filteredAlphabet = this.alphabet.split(''); // Initialize filtered alphabet with all letters
  }

  // Method to generate audio source path based on letter
  getAudioSrc(letter: string): string {
    return `assets/audio/alphabet/${letter.toUpperCase()}.mp3`;
  }

  // Method to play audio for a specific letter and update selectedLetter and searchLetter
  playAudio(letter: string): void {
    const audio = new Audio(this.getAudioSrc(letter)); // Create new audio element
    audio.play(); // Play the audio
    this.selectedLetter = letter; // Update selected letter
    this.updateSearchLetter(letter); // Update search letter with both cases
  }

  // Method to update searchLetter with both uppercase and lowercase versions of the letter
  updateSearchLetter(letter: string): void {
    this.searchLetter = `${letter.toUpperCase()} ${letter.toLowerCase()}`;
  }

  // HostListener for keypress event to handle playing audio and updating searchLetter
  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase(); // Get uppercase letter from keypress
    if (this.alphabet.includes(letter)) { // Check if the pressed key is a valid alphabet letter
      this.playAudio(letter); // Call playAudio method to play audio and update searchLetter
    }
  }

  // Method to filter alphabet based on searchLetter
  filterAlphabet(): void {
    this.filteredAlphabet = this.alphabet.split('').filter(letter =>
      letter.includes(this.searchLetter.toUpperCase()) // Filter alphabet based on searchLetter
    );
  }
}
