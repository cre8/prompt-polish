import { TestBed } from '@angular/core/testing';

import { AnthropicService } from './anthropic.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('AnthropicService', () => {
  let service: AnthropicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi())],
    });
    service = TestBed.inject(AnthropicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
