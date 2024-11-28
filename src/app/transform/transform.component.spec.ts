import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TransformComponent } from './transform.component';
import { AIService } from '../ai.service';
import { StorageService } from '../storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TransformComponent', () => {
  let component: TransformComponent;
  let fixture: ComponentFixture<TransformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformComponent, BrowserAnimationsModule],
      providers: [
        AIService,
        StorageService,
        provideHttpClientTesting(),
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Mock any necessary route parameters
            snapshot: {
              paramMap: {
                get: () => 'mockParam', // Mock any necessary route parameters
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
