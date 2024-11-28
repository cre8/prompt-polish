import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsComponent } from './prompts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PromptsComponent', () => {
  let component: PromptsComponent;
  let fixture: ComponentFixture<PromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptsComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
