import { Component, OnInit } from '@angular/core';
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


export class CardContainerComponent implements OnInit {
  cardInstances: CardInstance[] = [];
  cardInstancesOBSVALCHILD: CardInstance[] = [];
  // cards: string[] = [];
  cardInstanceNum = 20
  inputValueMsg:string = ""

  constructor(private cardHandlerService: CardHandlerService) {}

  ngOnInit(): void {
    this.cardHandlerService.inputMsgObservable.subscribe(inputValueMsg => this.inputValueMsg = inputValueMsg);
    this.cardHandlerService.cardInstancesOBSOBS.subscribe(cardInstancesOBSVAL => this.cardInstancesOBSVALCHILD = cardInstancesOBSVAL);  
    this.updateShownCards();
  }

  updateShownCards(){
    this.cardHandlerService.updateAvailableCardsData();
    this.cardInstances = this.cardHandlerService.updateShownCards();
  }

}