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
import { AnthropicService } from './anthropic.service';
import { AnthropicConfig } from './types';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-ai',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FlexLayoutModule,
    MatSnackBarModule,
  ],
  templateUrl: './anthropic.component.html',
  styleUrl: './anthropic.component.scss',
})
export class AnthropicComponent implements OnInit {
  // we need to define some basic models, because the list of models is fetched from the anthropic api only with a valid token
  models: string[] = [''];

  form = new FormGroup({
    apiKey: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
  });

  constructor(
    private storageService: StorageService,
    private snackbar: MatSnackBar,
    private anthropicService: AnthropicService
  ) {}

  ngOnInit(): void {
    this.anthropicService.getConfig().then(
      (config) => {
        this.form.setValue(config);
        // we are fething the models from the anthropic api, but this only works if the token is set
      },
      () => {
        //do nothing
      }
    );
    this.anthropicService.getModels().then((models) => (this.models = models));
  }

  submit() {
    this.anthropicService.validate(this.form.value as AnthropicConfig).then(
      () => {
        this.storageService
          .set(this.anthropicService.storageKey, this.form.value)
          .then(() => this.snackbar.open('Settings saved', 'Close'));
      },
      (err) => this.snackbar.open(err, 'Close')
    );
  }

  delete() {
    if (!confirm('Are you sure you want to delete the Anthropic settings?'))
      return;
    this.storageService.delete(this.anthropicService.storageKey).then(() => {
      this.form.reset();
      this.snackbar.open('Settings deleted', 'Close');
    });
  }
}
