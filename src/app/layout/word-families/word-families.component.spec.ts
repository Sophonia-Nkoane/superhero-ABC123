import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFamiliesComponent } from './word-families.component';

describe('WordFamiliesComponent', () => {
  let component: WordFamiliesComponent;
  let fixture: ComponentFixture<WordFamiliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordFamiliesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordFamiliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
