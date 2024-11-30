import { TestBed } from '@angular/core/testing';

import { AnthropicService } from './anthropic.service';

describe('AnthropicService', () => {
  let service: AnthropicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnthropicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
