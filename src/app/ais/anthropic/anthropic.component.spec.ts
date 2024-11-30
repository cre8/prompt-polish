import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnthropicComponent } from './anthropic.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AnthropicComponent', () => {
  let component: AnthropicComponent;
  let fixture: ComponentFixture<AnthropicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnthropicComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnthropicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
