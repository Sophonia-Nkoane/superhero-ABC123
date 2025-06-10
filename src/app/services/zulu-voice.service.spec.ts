/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ZuluVoiceService } from './zulu-voice.service';

describe('Service: ZuluVoice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZuluVoiceService]
    });
  });

  it('should ...', inject([ZuluVoiceService], (service: ZuluVoiceService) => {
    expect(service).toBeTruthy();
  }));
});
