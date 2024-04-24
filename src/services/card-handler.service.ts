import { Injectable } from '@angular/core';
import { DatabaseHandlerService } from './database-handler.service';
import { Card } from '../main-container/carddata-container/card';
import { CardInstance } from '../main-container/carddata-container/card-instance';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CardHandlerService {
  // allCards: { id: string, data: any }[] = [];

  // for showing - we need this to update the observable when its fully filled and not fill the observable directly
  cardInstances: CardInstance[] = [];
  cardInstanceNum = 0;


  // Observables
  // name input field 
  inputValueMsg = new BehaviorSubject<string>("def");
  inputMsgObservable = this.inputValueMsg.asObservable();

  //for data
  cards = new BehaviorSubject<{ id: string, data: any }[]>([]);
  cardsObservable = this.cards.asObservable();

  //for showing
  cardInstancesOBSVAL = new BehaviorSubject<CardInstance[]>([]);
  cardInstancesOBSOBS = this.cardInstancesOBSVAL.asObservable();

  
  constructor(private databaseHandlerService: DatabaseHandlerService) { }

  async getAllCards(): Promise<{ id: string, data: any }[]> {
    var returnable = await this.databaseHandlerService.getCards();
    return returnable;
  }

  updateAvailableCardsData(): string[] {
    this.getAllCards().then(cards => {
      this.cards.next(cards);
      return cards;
    }).catch(error => {
      console.error('Error fetching cards:', error);
    });
    return []
  }

  getCardsLength(): number {
    this.updateAvailableCardsData();
    return this.cards.value.length;
  }

  // Update the shown cards based on the ones in the db
  updateShownCards(){
    this.cardInstances = [];

    this.cardInstanceNum = this.getCardsLength();

    for (let i = 0; i < this.cardInstanceNum; i++) {
      let newCard: Card = {
        Color: this.cards.value[i].data["szin"],
        CardType: this.cards.value[i].data["laptipus"],
        Subtype: this.cards.value[i].data["altipus"],
        Name: this.cards.value[i].data["nev"],
        ManaCost: this.cards.value[i].data["mana-koltseg"],
        PowerToughness: this.cards.value[i].data["tamado-vedo"],
        Ability: this.cards.value[i].data["kepesseg"],
        PlusMana: this.cards.value[i].data["mana+"],
        PlusCardDraw: this.cards.value[i].data["laphuzo+"],
        Spirit: this.cards.value[i].data["spirit"],
        Release: this.cards.value[i].data["megjelenes"],
        CardNumber: this.cards.value[i].data["sorszam"],
        ImagePath: "feherszint.png_resize.jpg",
      };
      this.cardInstances.push(new CardInstance(newCard));
    }
    this.cardInstancesOBSVAL.next(this.cardInstances);
    return this.cardInstancesOBSVAL.value;
  }
}

