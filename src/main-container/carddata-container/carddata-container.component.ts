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

  // async isFileExists(imagePath: string): Promise<boolean> {
  //   return new Promise<boolean>((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => console.log("yes"); resolve(true); // Image loaded successfully
  //     img.onerror = () => console.log("no"); resolve(false); // Error loading image (file does not exist)
  //     img.src = `assets/pics/${imagePath}.png`; // Try to load the image
  //   });
  // }
}
