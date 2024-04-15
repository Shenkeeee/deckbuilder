import { Component, Input } from '@angular/core';
import { CardInstance } from "./card-instance"
import { NgFor, CommonModule } from '@angular/common';
import { Card } from './card';

@Component({
  selector: 'app-carddata-container',
  templateUrl: './carddata-container.component.html',
  styleUrls: ['./carddata-container.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CarddataContainerComponent {
  
  @Input() cardInstance!: CardInstance;
  constructor() {
  
  }
}
