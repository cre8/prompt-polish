import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatIconModule } from '@angular/material/icon';

export type Prompt = string;

@Component({
  selector: 'app-prompts',
  imports: [
    MatListModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  templateUrl: './prompts.component.html',
  styleUrl: './prompts.component.scss',
})
export class PromptsComponent implements OnInit {
  prompts: string[] = [];

  form = new FormGroup({
    prompt: new FormControl('', Validators.required),
  });

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService
      .get<Prompt[]>('prompts')
      .then((prompts) => (this.prompts = prompts ?? []));
  }

  async add() {
    this.prompts.push(this.form.value.prompt as string);
    await this.storageService.set('prompts', this.prompts);
    this.form.reset();
  }

  remove(elements: MatListOption[]) {
    this.prompts = this.prompts.filter(
      (prompt) => !elements.find((element) => element.value === prompt)
    );
    this.storageService.set('prompts', this.prompts);
  }
}
