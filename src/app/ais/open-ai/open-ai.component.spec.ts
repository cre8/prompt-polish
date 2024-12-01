import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenAIComponent } from './open-ai.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('OpenAIComponent', () => {
  let component: OpenAIComponent;
  let fixture: ComponentFixture<OpenAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenAIComponent, BrowserAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
