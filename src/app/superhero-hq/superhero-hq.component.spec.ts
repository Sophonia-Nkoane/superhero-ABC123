import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroHqComponent } from './superhero-hq.component';

describe('SuperheroHqComponent', () => {
  let component: SuperheroHqComponent;
  let fixture: ComponentFixture<SuperheroHqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroHqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperheroHqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
