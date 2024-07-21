import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceBuildingComponent } from './sentence-building.component';

describe('SentenceBuildingComponent', () => {
  let component: SentenceBuildingComponent;
  let fixture: ComponentFixture<SentenceBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentenceBuildingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentenceBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
