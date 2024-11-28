import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAIComponent } from './open-ai.component';

describe('OpenAIComponent', () => {
  let component: OpenAIComponent;
  let fixture: ComponentFixture<OpenAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenAIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
