import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AisComponent } from './ais.component';
import { AIService } from './ai.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AisComponent', () => {
  let component: AisComponent;
  let fixture: ComponentFixture<AisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AisComponent, BrowserAnimationsModule],
      providers: [AIService, provideHttpClient(withInterceptorsFromDi())],
    }).compileComponents();

    fixture = TestBed.createComponent(AisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
