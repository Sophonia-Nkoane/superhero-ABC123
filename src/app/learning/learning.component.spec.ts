import { ComponentFixture, TestBed } from '@angular/core/testing';

import { learningComponent } from './learning.component';

describe('LearningComponent', () => {
  let component: learningComponent;
  let fixture: ComponentFixture<learningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [learningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(learningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
