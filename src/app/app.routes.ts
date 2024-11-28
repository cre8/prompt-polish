import { Routes } from '@angular/router';
import { TransformComponent } from './transform/transform.component';
import { OpenAIComponent } from './ais/open-ai/open-ai.component';
import { PromptsComponent } from './prompts/prompts.component';

export const routes: Routes = [
  {
    path: '',
    component: TransformComponent,
  },
  {
    path: 'openai',
    component: OpenAIComponent,
  },
  {
    path: 'prompts',
    component: PromptsComponent,
  },
];
