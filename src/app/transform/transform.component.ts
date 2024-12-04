import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { AIService } from '../ais/ai.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { Prompt } from '../prompts/prompts.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-transform',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ClipboardModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './transform.component.html',
  styleUrl: './transform.component.scss',
})
export class TransformComponent implements OnInit, OnDestroy {
  prompts: string[] = [];
  services: string[] = [];
  loading = false;

  filteredOptions!: Observable<string[]>;

  form = new FormGroup({
    service: new FormControl('', Validators.required),
    prompt: new FormControl('', Validators.required),
    input: new FormControl('', Validators.required),
  });
  output = new FormControl('', Validators.required);
  popup = false;

  constructor(
    private aiService: AIService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.prompts = await this.storageService
      .get<Prompt[]>('prompts')
      .catch(() => []);
    const input = this.route.snapshot.queryParams['input'] ?? '';
    let prompt = this.route.snapshot.queryParams['prompt'];
    const auto = this.route.snapshot.queryParams['auto'];

    this.filteredOptions = this.form.controls.prompt.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterPrompts(value || ''))
    );

    const configured = await this.aiService
      .isConfigured()
      .then(() => true)
      .catch(() => {
        this.snackbar
          .open('Please configure the AI in the options page', 'Configure AI')
          .onAction()
          .subscribe(() => this.router.navigate(['/ais']));
        return false;
      });

    if (!configured) return;
    // get is list of all configured services
    this.services = await this.aiService.getServices();
    const service = await this.aiService
      .selectedService()
      .catch(() => this.services[0]);

    if (this.prompts.length === 0) {
      this.snackbar
        .open('Please add prompts in the options page', 'Add propmpts')
        .onAction()
        .subscribe(() => this.router.navigate(['/prompts']));
      return;
    }
    if (!prompt) {
      prompt = await this.storageService
        .get<string>('prompt')
        .catch(() => this.prompts[0]);
    }

    this.form.setValue({
      service,
      prompt,
      input,
    });

    if (input) {
      this.popup = true;
      await this.transform();
      //save the value for the next time
      await this.storageService.set('prompt', this.form.value.prompt);
      await this.aiService.setService(this.form.value.service!);
      //either allow to auto process for a defined origin or add a new hotkey to do so
    }
    if (auto) {
      this.insert();
    }
  }

  /**
   * Clean up the snackbar
   */
  ngOnDestroy(): void {
    this.snackbar.dismiss();
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

  /**
   * Transforms the input text
   * @returns
   */
  async transform() {
    this.loading = true;
    await this.aiService
      .request(
        this.form.value.service!,
        `${this.form.value.prompt}: ${this.form.value.input}`
      )
      .then(
        (response) => {
          this.output.setValue(response);
        },
        (err) => this.snackbar.open(err, 'Close')
      );
    this.loading = false;
  }

  /**
   * Replaces the selected text with the transformed text
   */
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

  /**
   * Filters the prompts based on the input value
   * @param value
   * @returns
   */
  private filterPrompts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.prompts.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
