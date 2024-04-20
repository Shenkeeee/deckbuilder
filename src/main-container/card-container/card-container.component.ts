import { Component } from '@angular/core';
import { CarddataContainerComponent } from "../carddata-container/carddata-container.component"
import { CommonModule } from '@angular/common';
import { CardInstance } from "../carddata-container/card-instance";
import { Card } from "../carddata-container/card";
import { CardHandlerService } from '../../services/card-handler.service';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CarddataContainerComponent, CommonModule],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss'
})


export class CardContainerComponent {
  cardInstances: CardInstance[] = [];
  cardInstanceNum = 20

  constructor(private cardHandlerService: CardHandlerService) {
    this.cardInstances = this.cardHandlerService.updateShownCards();
  }

}