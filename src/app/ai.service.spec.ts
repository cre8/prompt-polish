import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AIService } from './ai.service';
import { provideHttpClient } from '@angular/common/http';

describe('AIService', () => {
  let service: AIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['get']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AIService],
    });

    service = TestBed.inject(AIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests here
});
