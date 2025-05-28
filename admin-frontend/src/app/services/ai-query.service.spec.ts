import { TestBed } from '@angular/core/testing';

import { AiQueryService } from './ai-query.service';

describe('AiQueryService', () => {
  let service: AiQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
