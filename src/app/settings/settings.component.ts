import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface PastHotKey {
  specialKey: string;
  hotKey: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  pastHotKey = new FormGroup({
    specialKey: new FormControl('ctrl', Validators.required),
    hotKey: new FormControl('a', Validators.required),
  });

  specialKeys = ['ctrl'];

  constructor(private storageService: StorageService) {}

  async ngOnInit(): Promise<void> {
    await this.storageService.get<PastHotKey>('pastHotKey').then(
      (hotKeys) => this.pastHotKey.setValue(hotKeys),
      () => {
        //do nothing
      }
    );
  }

  saveKeys() {
    this.storageService.set('pastHotKey', this.pastHotKey.value);
  }
}
