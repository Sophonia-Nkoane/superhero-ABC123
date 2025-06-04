import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellingComponent } from './spelling.component';

describe('SpellingComponent', () => {
  let component: SpellingComponent;
  let fixture: ComponentFixture<SpellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
