import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { StorageService } from '../../storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OpenAIConfig } from './types';

@Component({
  selector: 'app-open-ai',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule,
  ],
  templateUrl: './open-ai.component.html',
  styleUrl: './open-ai.component.scss',
})
export class OpenAIComponent implements OnInit {
  form = new FormGroup({
    token: new FormControl('', Validators.required),
    projectId: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
  });

  constructor(
    private storageService: StorageService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.storageService
      .get<OpenAIConfig>('openAI')
      .then((data) => this.form.setValue(data));
  }

  submit() {
    this.storageService
      .put('openAI', this.form.value)
      .then(() => this.snackbar.open('Settings saved', 'Close'));
  }
}
