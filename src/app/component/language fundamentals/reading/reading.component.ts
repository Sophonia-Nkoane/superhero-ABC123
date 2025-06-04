import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { VoiceService } from '../../../services/voice.service';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css']
})
export class ReadingComponent implements OnInit {
  passage: string [] = [];
  words: string[] = [];
  currentWordIndex = 0;
  readingSpeed = 0;
  startTime = 0;
  finishTime = 0;
  readWords: boolean[] = new Array(this.words.length).fill(false);
  wordCount = 0;
  timerInterval: any;
  elapsedSeconds = 0;
  elapsedMinutes = 0;

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getPassage().subscribe(passage => {
      this.passage = passage;
      this.words = passage.join(' ').split(' ');
    });
  }

  startTimer() {
    this.startTime = new Date().getTime();
    this.currentWordIndex = 0;
    this.wordCount = 0;
    this.elapsedSeconds = 0;
    this.elapsedMinutes = 0;
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      if (this.elapsedSeconds >= 60) {
        this.elapsedMinutes++;
        this.elapsedSeconds = 0;
      }
    }, 1000);
  }

  finishTimer() {
    clearInterval(this.timerInterval);
    this.finishTime = new Date().getTime();
    const timeTaken = (this.finishTime - this.startTime) / 1000;
    this.readingSpeed = this.wordCount / timeTaken;
  }

  onWordClick(index: number) {
    this.currentWordIndex = index;
    this.playWord(index);
    this.markAsRead(index);
    this.wordCount++;
  }

  playWord(index: number) {
    const word = this.words[index];
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  }

  markAsRead(index: number) {
    this.readWords[index] = true;
  }

  isWordRead(index: number) {
    return this.readWords[index];
  }
}
