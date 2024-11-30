import { Component, HostListener, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { Prompt } from '../prompts/prompts.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],
  templateUrl: './transform.component.html',
  styleUrl: './transform.component.scss',
})
export class TransformComponent implements OnInit {
  prompts: string[] = [];
  form = new FormGroup({
    prompt: new FormControl('', Validators.required),
    input: new FormControl('', Validators.required),
  });
  output = new FormControl('', Validators.required);
  popup = false;

  constructor(
    private aiService: AIService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snakbar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.prompts = (await this.storageService.get<Prompt[]>('prompts')) ?? [];
    const input = this.route.snapshot.queryParams['input'] ?? '';

    if (this.prompts.length === 0) {
      this.snakbar
        .open('Please add prompts in the options page', 'Add propmpts')
        .onAction()
        .subscribe(() => this.router.navigate(['/prompts']));
      return;
    }

    this.form.setValue({
      prompt: this.prompts[0],
      input,
    });

    if (input) {
      this.popup = true;
      await this.transform();
      //either allow to auto process for a defined origin or add a new hotkey to do so
    }
  }

  /**
   * Listen to the key command to enter the transformed text
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    //TODO: allow the user to customize the key command
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault(); // Prevent default browser behavior
      this.insert();
    }
  }

  transform() {
    return this.aiService
      .request(`${this.form.value.prompt}: ${this.form.value.input}`)
      .then(
        (response) => {
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
