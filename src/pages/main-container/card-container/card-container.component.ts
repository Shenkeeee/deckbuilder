import { Component, OnInit } from '@angular/core';
import { CarddataContainerComponent } from '../carddata-container/carddata-container.component';
import { CommonModule } from '@angular/common';
import { CardInstance } from '../../../assets/model/carddata-container/card-instance';
import { CardHandlerService } from '../../../services/card-handler.service';

import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CarddataContainerComponent, CommonModule, MatChipsModule],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss'
})


export class CardContainerComponent implements OnInit {
  // cardInstances: CardInstance[] = [];
  cardInstancesOBSVALCHILD: CardInstance[] = [];
  inputValueMsg: string = "";
  selectedColors: string[] = [];

  constructor(private cardHandlerService: CardHandlerService) { }

  ngOnInit(): void {
    this.cardHandlerService.inputMsgObservable.subscribe(inputValueMsg => this.inputValueMsg = inputValueMsg);
    this.cardHandlerService.cardInstancesOBSOBS.subscribe(cardInstancesOBSVAL => this.cardInstancesOBSVALCHILD = cardInstancesOBSVAL);
    this.cardHandlerService.selectedColorsObs.subscribe(colors => this.selectedColors = colors);
    this.updateShownCards();
  }

  onColorChanges(color: string) {
    const colorIndex = this.selectedColors.indexOf(color);
    if (colorIndex === -1) {
      // Ha a szín még nincs a tömbben, akkor hozzáadjuk
      this.selectedColors.push(color);
    } else {
      // Ha a szín már benne van a tömbben, akkor kivesszük
      this.selectedColors.splice(colorIndex, 1);
    }
    this.changeColors();
  }

  changeColors() {
    this.cardHandlerService.selectedColors.next(this.selectedColors);
    // console.log(this.selectedColors);
    this.updateShownCards();
  }

  updateShownCards() {
    // this.cardHandlerService.updateCardsData();
    // this.cardHandlerService.updateShownCards().then(cards => this.cardInstances = cards);
    this.cardHandlerService.updateShownCards();
  }

}