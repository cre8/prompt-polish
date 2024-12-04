import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { OpenAIService } from './open-ai.service';
import { OpenAIConfig } from './types';
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
  templateUrl: './open-ai.component.html',
  styleUrl: './open-ai.component.scss',
})
export class OpenAIComponent implements OnInit, OnDestroy {
  // we need to define some basic models, because the list of models is fetched from the openai api only with a valid token
  models: string[] = ['gpt-4o-mini'];

  form = new FormGroup({
    apiKey: new FormControl('', Validators.required),
    projectId: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
  });

  constructor(
    private storageService: StorageService,
    private snackbar: MatSnackBar,
    private openAIService: OpenAIService
  ) {}

  ngOnInit(): void {
    this.openAIService.getConfig().then(
      (config) => {
        this.form.setValue(config);
        // we are fething the models from the openai api, but this only works if the token is set
        this.openAIService.getModels().then((models) => (this.models = models));
      },
      () => {
        //do nothing
      }
    );
  }

  /**
   * Clean up the snackbar
   */
  ngOnDestroy(): void {
    this.snackbar.dismiss();
  }

  submit() {
    this.openAIService.validate(this.form.value as OpenAIConfig).then(
      () => {
        this.storageService
          .set(this.openAIService.storageKey, this.form.value)
          .then(() => this.snackbar.open('Settings saved', 'Close'));
      },
      (err) => this.snackbar.open(err, 'Close')
    );
  }

  delete() {
    if (!confirm('Are you sure you want to delete the OpenAI settings?'))
      return;
    this.storageService.delete(this.openAIService.storageKey).then(() => {
      this.form.reset();
      this.snackbar.open('Settings deleted', 'Close');
    });
  }
}
