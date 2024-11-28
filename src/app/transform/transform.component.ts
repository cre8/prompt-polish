import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { AIService } from '../ai.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage.service';
import { Prompt } from '../prompts/prompts.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-transform',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ClipboardModule,
  ],
  templateUrl: './transform.component.html',
  styleUrl: './transform.component.scss',
})
export class TransformComponent implements OnInit {
  prompts: string[] = [];
  form = new FormGroup({
    prompt: new FormControl(),
    input: new FormControl('', Validators.required),
  });
  output = new FormControl('', Validators.required);
  popup = false;

  constructor(
    private aiService: AIService,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.prompts = (await this.storageService.get<Prompt[]>('prompts')) ?? [];
    const input = this.route.snapshot.queryParams['input'] ?? '';
    if (input) {
      this.popup = true;
      this.transform();
    }

    this.form.setValue({
      prompt: this.prompts[0],
      input,
    });
  }

  transform() {
    this.aiService
      .request(`${this.form.value.prompt}: ${this.form.value.input}`)
      .then(
        (response) => {
          console.log('Response:', response);
          this.output.setValue(response);
        },
        (err) => alert(err)
      );
  }

  insert(): void {
    const transformedText = this.output.value;
    chrome.runtime
      .sendMessage({
        action: 'replaceSelectedText',
        text: transformedText,
      })
      .then(() => {
        window.close();
      });
  }

  copy() {
    throw new Error('Method not implemented.');
  }
}
