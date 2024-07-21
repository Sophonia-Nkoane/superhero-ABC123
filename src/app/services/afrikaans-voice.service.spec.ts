/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AfrikaansVoiceService } from './afrikaans-voice.service';


describe('Service: AfrikaansVoice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AfrikaansVoiceService]
    });
  });

  it('should ...', inject([AfrikaansVoiceService], (service: AfrikaansVoiceService) => {
    expect(service).toBeTruthy();
  }));
});
