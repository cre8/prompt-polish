import { Routes } from '@angular/router';
import { TransformComponent } from './transform/transform.component';
import { PromptsComponent } from './prompts/prompts.component';
import { AisComponent } from './ais/ais.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: TransformComponent,
  },
  {
    path: 'ais',
    component: AisComponent,
  },
  {
    path: 'prompts',
    component: PromptsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
