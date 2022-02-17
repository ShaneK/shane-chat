import { TestBed } from '@angular/core/testing';

import { SseService } from './sse.service';

describe('SSEService', () => {
  let service: SseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
