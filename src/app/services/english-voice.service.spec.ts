/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnglishVoiceService } from './english-voice.service';

describe('Service: EnglishVoice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnglishVoiceService]
    });
  });

  it('should ...', inject([EnglishVoiceService], (service: EnglishVoiceService) => {
    expect(service).toBeTruthy();
  }));
});
