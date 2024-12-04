import { Type } from '@angular/core';
import { AI } from './ai.class';

export interface Service {
  label: string;
  service: AI<unknown>;
  component: Type<unknown>;
}
