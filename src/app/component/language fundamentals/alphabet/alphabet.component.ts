import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VoiceService } from '../../../services/voice.service';
import { DataService, Object as DataObject } from '../../../services/data.service';
import { GlobalSettingsService } from '../../../services/global-settings.service';
import { playAlphabetSound, playPhoneticSound, playObjectSound, delay, getLetterStrokes } from '../../language';

// NEW: Interface for a single stroke guide
interface Stroke {
  path: string;
  number: number;
  numberPos: { x: number, y: number };
}

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit, OnDestroy, AfterViewInit {
  // --- VIEW MANAGEMENT ---
  activeView: 'alphabet' | 'trace' = 'alphabet';

  // --- SHARED PROPERTIES ---
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // --- ALPHABET EXPLORER PROPERTIES ---
  filteredAlphabet: string[] = [];
  mode = 'all';
  isReading = false;
  isAutoRead = false;
  objects: DataObject[] = [];
  currentLanguage: 'English' | 'Afrikaans' = 'English';
  private languageSubscription!: Subscription;
  selectedItem: string | null = null;

  // --- LETTER TRACER PROPERTIES ---
  currentLetter = 'A';
  currentIndex = 0;
  isCelebrating = false;
  tracerSoundMode: 'alphabet' | 'phonics' = 'alphabet';

  // Uppercase Tracer
  @ViewChild('tracingCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  isDrawingUppercase = false;
  uppercaseProgress = 0;
  uppercaseFeedbackMessage = '';
  uppercaseFeedbackClass = 'feedback';
  private uppercaseCtx!: CanvasRenderingContext2D;
  private uppercasePaths: { x: number, y: number }[][] = [];
  private isUppercaseComplete = false;
  uppercaseStrokes: Stroke[] = []; // NEW: Holds stroke guides for uppercase letter

  // Lowercase Tracer
  @ViewChild('lowercaseTracingCanvas') lowercaseCanvasRef!: ElementRef<HTMLCanvasElement>;
  isDrawingLowercase = false;
  lowercaseProgress = 0;
  lowercaseFeedbackMessage = '';
  lowercaseFeedbackClass = 'feedback';
  private lowercaseCtx!: CanvasRenderingContext2D;
  private lowercasePaths: { x: number, y: number }[][] = [];
  private isLowercaseComplete = false;
  lowercaseStrokes: Stroke[] = []; // NEW: Holds stroke guides for lowercase letter

  constructor(
    private voiceService: VoiceService,
    private dataService: DataService,
    private globalSettingsService: GlobalSettingsService,
    private cdr: ChangeDetectorRef
  ) {}

  // --- LIFECYCLE HOOKS ---
  ngOnInit() {
    this.currentLanguage = this.globalSettingsService.getLanguage() as 'English' | 'Afrikaans';
    this.filteredAlphabet = this.alphabet.split('');
    this.dataService.getObjects().subscribe(objects => (this.objects = objects));
    this.languageSubscription = this.globalSettingsService
      .onLanguageChange()
      .subscribe(language => {
        if (language === 'English' || language === 'Afrikaans') {
          this.currentLanguage = language;
          if (this.currentLanguage === 'Afrikaans' && this.mode === 'phonics') {
            this.mode = 'all';
          }
          if (this.currentLanguage === 'Afrikaans') {
            this.tracerSoundMode = 'alphabet';
          }
        }
      });
  }

  ngAfterViewInit(): void {
    // Setup will be handled by setView
  }

  ngOnDestroy() {
    this.stopReading();
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  // --- HOST LISTENERS ---
  @HostListener('window:resize')
  onResize(): void {
    if (this.activeView === 'trace') {
      if (this.uppercaseCtx) {
        this.setupUppercaseCanvas();
        this.redrawUppercasePaths();
      }
      if (this.lowercaseCtx) {
        this.setupLowercaseCanvas();
        this.redrawLowercasePaths();
      }
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (this.activeView === 'alphabet') {
      const letter = event.key.toUpperCase();
      if (this.alphabet.includes(letter)) this.playPhoneticSpeech(letter);
    }
  }

  // --- VIEW MANAGEMENT METHOD ---
  setView(view: 'alphabet' | 'trace') {
    if (this.activeView === view) return;
    this.activeView = view;
    if (view === 'trace' && !this.uppercaseCtx) {
      this.cdr.detectChanges(); // Allow canvases to be rendered
      this.setupTracer();
    }
  }

  private setupTracer() {
    if (this.canvasRef) {
      this.setupUppercaseCanvas();
    }
    if (this.lowercaseCanvasRef) {
      this.setupLowercaseCanvas();
    }
    this.updateStrokeGuides(); // NEW: Initial generation of stroke guides
  }

  // ===============================================
  // ALPHABET EXPLORER METHODS
  // ===============================================
  public playPhoneticSpeech(letter: string): void {
    if (this.isReading) return;
    this._playSpeechSequence(letter);
  }

  private async _playSpeechSequence(letter: string): Promise<void> {
    this.isReading = true;
    this.selectedItem = letter;

    try {
      if (this.mode === 'all') {
        await playAlphabetSound(this.voiceService, letter, this.currentLanguage);
        await delay(500);
        if (this.currentLanguage === 'English') {
          await playPhoneticSound(letter);
          await delay(500);
        }
        const object = this.objects.find(obj => obj.letter === letter);
        if (object) { await playObjectSound(this.voiceService, object.object, this.currentLanguage); }
      } else {
        if (this.mode === 'alphabet') await playAlphabetSound(this.voiceService, letter, this.currentLanguage);
        if (this.mode === 'phonics' && this.currentLanguage === 'English') await playPhoneticSound(letter);
        if (this.mode === 'objects') {
          const object = this.objects.find(obj => obj.letter === letter);
          if (object) { await playObjectSound(this.voiceService, object.object, this.currentLanguage); }
        }
      }
    } finally {
      this.isReading = false;
    }
  }

  async readAll(): Promise<void> {
    this.isReading = true;
    for (const letter of this.filteredAlphabet) {
      if (!this.isAutoRead) break;
      await this._playSpeechSequence(letter);
      await delay(1000);
    }
    if (this.isAutoRead) this.toggleAutoRead();
    this.stopReading();
  }

  toggleAutoRead(): void {
    this.isAutoRead = !this.isAutoRead;
    if (this.isAutoRead) this.readAll();
    else this.stopReading();
  }

  stopReading(): void {
    this.isReading = false;
    this.isAutoRead = false;
  }

  closeFocusView(): void {
    this.selectedItem = null;
    if (this.isAutoRead) this.stopReading();
  }

  toggleMode(mode: string): void {
    if (mode === 'phonics' && this.currentLanguage === 'Afrikaans') return;
    this.mode = mode;
  }

  getObject = (letter: string): string => this.objects.find(obj => obj.letter === letter)?.object || '';
  getObjectIcon = (letter: string): string => this.objects.find(obj => obj.letter === letter)?.icon || '';

  getAriaLabel(letter: string): string {
    switch (this.mode) {
      case 'phonics': return `Phonetic ${letter.toLowerCase()}`;
      case 'objects': return `${this.getObject(letter)} for letter ${letter}`;
      default: return `Letter ${letter}`;
    }
  }

  // ===============================================
  // LETTER TRACER METHODS
  // ===============================================
  get soundModeButtonText(): string {
    return this.tracerSoundMode === 'alphabet' ? 'Phonics' : 'Alphabet';
  }

  toggleTracerSoundMode(): void {
    this.tracerSoundMode = this.tracerSoundMode === 'alphabet' ? 'phonics' : 'alphabet';
    this.playCurrentTracerSound();
  }

  playCurrentTracerSound(): void {
    if (this.tracerSoundMode === 'phonics' && this.currentLanguage === 'English') {
      playPhoneticSound(this.currentLetter);
    } else {
      playAlphabetSound(this.voiceService, this.currentLetter, this.currentLanguage);
    }
  }

  private getEventPos(e: MouseEvent | Touch, canvasEl: HTMLCanvasElement): { x: number; y: number } {
    const rect = canvasEl.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private setupCanvas(
    canvasRef: ElementRef<HTMLCanvasElement>,
    ctxProperty: 'uppercaseCtx' | 'lowercaseCtx'
  ): void {
    const canvas = canvasRef.nativeElement;
    const container = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = container.offsetWidth + 'px';
    canvas.style.height = container.offsetHeight + 'px';
    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.offsetHeight * dpr;
    this[ctxProperty] = canvas.getContext('2d')!;
    this[ctxProperty].scale(dpr, dpr);
    this[ctxProperty].lineCap = 'round';
    this[ctxProperty].lineJoin = 'round';
    this[ctxProperty].strokeStyle = 'var(--trace-color)';
    this[ctxProperty].lineWidth = 12;
  }

  private setupUppercaseCanvas(): void {
    this.setupCanvas(this.canvasRef, 'uppercaseCtx');
  }

  private setupLowercaseCanvas(): void {
    this.setupCanvas(this.lowercaseCanvasRef, 'lowercaseCtx');
  }

  // --- Drawing Logic: Uppercase ---
  startUppercaseDrawing(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    this.isDrawingUppercase = true;
    const pos = this.getEventPos(e instanceof MouseEvent ? e : e.touches[0], this.canvasRef.nativeElement);
    this.uppercaseCtx.beginPath();
    this.uppercaseCtx.moveTo(pos.x, pos.y);
    this.uppercasePaths.push([{ x: pos.x, y: pos.y }]);
  }

  drawUppercase(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawingUppercase) return;
    e.preventDefault();
    const pos = this.getEventPos(e instanceof MouseEvent ? e : e.touches[0], this.canvasRef.nativeElement);
    this.uppercaseCtx.lineTo(pos.x, pos.y);
    this.uppercaseCtx.stroke();
    if (this.uppercasePaths.length > 0) {
      this.uppercasePaths[this.uppercasePaths.length - 1].push({ x: pos.x, y: pos.y });
    }
  }

  stopUppercaseDrawing(): void {
    if (!this.isDrawingUppercase) return;
    this.isDrawingUppercase = false;
    this.updateUppercaseProgress();
  }

  // --- Drawing Logic: Lowercase ---
  startLowercaseDrawing(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    this.isDrawingLowercase = true;
    const pos = this.getEventPos(e instanceof MouseEvent ? e : e.touches[0], this.lowercaseCanvasRef.nativeElement);
    this.lowercaseCtx.beginPath();
    this.lowercaseCtx.moveTo(pos.x, pos.y);
    this.lowercasePaths.push([{ x: pos.x, y: pos.y }]);
  }

  drawLowercase(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawingLowercase) return;
    e.preventDefault();
    const pos = this.getEventPos(e instanceof MouseEvent ? e : e.touches[0], this.lowercaseCanvasRef.nativeElement);
    this.lowercaseCtx.lineTo(pos.x, pos.y);
    this.lowercaseCtx.stroke();
    if (this.lowercasePaths.length > 0) {
      this.lowercasePaths[this.lowercasePaths.length - 1].push({ x: pos.x, y: pos.y });
    }
  }

  stopLowercaseDrawing(): void {
    if (!this.isDrawingLowercase) return;
    this.isDrawingLowercase = false;
    this.updateLowercaseProgress();
  }

  // --- Path Redrawing ---
  private redrawUppercasePaths(): void {
    this.uppercaseCtx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.uppercasePaths.forEach(path => {
      if (path.length > 0) {
        this.uppercaseCtx.beginPath();
        this.uppercaseCtx.moveTo(path[0].x, path[0].y);
        path.forEach(point => this.uppercaseCtx.lineTo(point.x, point.y));
        this.uppercaseCtx.stroke();
      }
    });
  }

  private redrawLowercasePaths(): void {
    this.lowercaseCtx.clearRect(0, 0, this.lowercaseCanvasRef.nativeElement.width, this.lowercaseCanvasRef.nativeElement.height);
    this.lowercasePaths.forEach(path => {
      if (path.length > 0) {
        this.lowercaseCtx.beginPath();
        this.lowercaseCtx.moveTo(path[0].x, path[0].y);
        path.forEach(point => this.lowercaseCtx.lineTo(point.x, point.y));
        this.lowercaseCtx.stroke();
      }
    });
  }

  // --- General Tracer Controls ---
  clearTracing(): void {
    if (this.uppercaseCtx) {
      this.uppercaseCtx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
    this.uppercasePaths = [];
    this.uppercaseProgress = 0;
    this.uppercaseFeedbackMessage = '';
    this.uppercaseFeedbackClass = 'feedback';
    this.isUppercaseComplete = false;

    if (this.lowercaseCtx) {
      this.lowercaseCtx.clearRect(0, 0, this.lowercaseCanvasRef.nativeElement.width, this.lowercaseCanvasRef.nativeElement.height);
    }
    this.lowercasePaths = [];
    this.lowercaseProgress = 0;
    this.lowercaseFeedbackMessage = '';
    this.lowercaseFeedbackClass = 'feedback';
    this.isLowercaseComplete = false;
  }

  nextLetter(): void {
    this.currentIndex = (this.currentIndex + 1) % this.alphabet.length;
    this.changeLetter(this.alphabet[this.currentIndex]);
  }

  previousLetter(): void {
    this.currentIndex = (this.currentIndex - 1 + this.alphabet.length) % this.alphabet.length;
    this.changeLetter(this.alphabet[this.currentIndex]);
  }

  private changeLetter(letter: string): void {
    this.currentLetter = letter;
    this.clearTracing();
    this.updateStrokeGuides(); // NEW: Update guides for the new letter
  }

  // --- Progress & Feedback ---
  private updateUppercaseProgress(): void {
    const canvas = this.canvasRef.nativeElement;
    const imageData = this.uppercaseCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let drawnPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] > 0) drawnPixels++; }
    const totalPixels = (canvas.width * canvas.height) / ((window.devicePixelRatio || 1) ** 2);
    this.uppercaseProgress = Math.min((drawnPixels / totalPixels) * 100 * 20, 100);

    if (this.uppercaseProgress < 30) {
      this.uppercaseFeedbackMessage = 'Keep tracing! 🖍️';
      this.uppercaseFeedbackClass = 'feedback';
    } else if (this.uppercaseProgress < 60) {
      this.uppercaseFeedbackMessage = 'Great job! Keep going! 👍';
      this.uppercaseFeedbackClass = 'feedback';
    } else if (this.uppercaseProgress < 90) {
      this.uppercaseFeedbackMessage = 'Almost there! 🌟';
      this.uppercaseFeedbackClass = 'feedback';
    } else {
      this.uppercaseFeedbackMessage = 'Excellent work! 🎉';
      this.uppercaseFeedbackClass = 'feedback success';
      this.celebrate();
      if (!this.isUppercaseComplete) {
        this.playCurrentTracerSound();
        this.isUppercaseComplete = true;
      }
    }
  }

  private updateLowercaseProgress(): void {
    const canvas = this.lowercaseCanvasRef.nativeElement;
    const imageData = this.lowercaseCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let drawnPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] > 0) drawnPixels++; }
    const totalPixels = (canvas.width * canvas.height) / ((window.devicePixelRatio || 1) ** 2);
    this.lowercaseProgress = Math.min((drawnPixels / totalPixels) * 100 * 20, 100);

    if (this.lowercaseProgress < 30) {
      this.lowercaseFeedbackMessage = 'You can do it! 💪';
      this.lowercaseFeedbackClass = 'feedback';
    } else if (this.lowercaseProgress < 60) {
      this.lowercaseFeedbackMessage = 'Looking good! ✅';
      this.lowercaseFeedbackClass = 'feedback';
    } else if (this.lowercaseProgress < 90) {
      this.lowercaseFeedbackMessage = 'So close! ✨';
      this.lowercaseFeedbackClass = 'feedback';
    } else {
      this.lowercaseFeedbackMessage = 'Perfect! 🎈';
      this.lowercaseFeedbackClass = 'feedback success';
      this.celebrate();
      if (!this.isLowercaseComplete) {
        this.playCurrentTracerSound();
        this.isLowercaseComplete = true;
      }
    }
  }

  private celebrate(): void {
    this.isCelebrating = true;
    setTimeout(() => { this.isCelebrating = false; }, 2000);
  }

  // --- NEW: Stroke Guide Generation ---
  private updateStrokeGuides(): void {
    this.uppercaseStrokes = getLetterStrokes(this.currentLetter, 'upper');
    this.lowercaseStrokes = getLetterStrokes(this.currentLetter, 'lower');
  }
}
