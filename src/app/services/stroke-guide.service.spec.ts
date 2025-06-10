/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StrokeGuideService } from './stroke-guide.service';

describe('Service: StrokeGuide', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StrokeGuideService]
    });
  });

  it('should ...', inject([StrokeGuideService], (service: StrokeGuideService) => {
    expect(service).toBeTruthy();
  }));
});
