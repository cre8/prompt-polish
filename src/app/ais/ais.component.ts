import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AIService } from './ai.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ais',
  imports: [MatTabsModule, CommonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './ais.component.html',
  styleUrls: ['./ais.component.scss'],
})
export class AisComponent implements OnInit {
  // list of all services
  services: string[] = [];

  // form field for the selected service
  selection = new FormControl('');

  constructor(public aiService: AIService) {}

  async ngOnInit(): Promise<void> {
    // get a list of all services with a valid config
    this.services = await this.aiService.getServices();
    this.aiService
      .selectedService()
      // if no service is selected, default to the first one
      .catch(() => this.services[0])
      .then((service) => this.selection.setValue(service));

    this.selection.valueChanges.subscribe((service) =>
      this.aiService.setService(service!)
    );
  }
}
