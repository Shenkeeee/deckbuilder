import { Injectable } from '@angular/core';
import { DatabaseHandlerService } from './database-handler.service';
import { Card } from '../main-container/carddata-container/card';
import { CardInstance } from '../main-container/carddata-container/card-instance';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CardHandlerService {
  // allCards: { id: string, data: any }[] = [];

  // for showing - we need this to update the observable when its fully filled and not fill the observable directly
  cardInstances: CardInstance[] = [];
  allcardInstances: CardInstance[] = [];
  cardInstanceNum = 0;


  // Observables
  // name input field 
  inputValueMsg = new BehaviorSubject<string>("");
  inputMsgObservable = this.inputValueMsg.asObservable();


  // allCards = new BehaviorSubject<{ id: string, data: any }[]>([]);
  // allCardsObservable = this.allCards.asObservable();
  
  // for data of all
  cards = new BehaviorSubject<{ id: string, data: any }[]>([]);
  cardsObservable = this.cards.asObservable();

  // for showing of filtered
  cardInstancesOBSVAL = new BehaviorSubject<CardInstance[]>([]);
  cardInstancesOBSOBS = this.cardInstancesOBSVAL.asObservable();

  
  constructor(private databaseHandlerService: DatabaseHandlerService) { }

  async getAllCards(): Promise<{ id: string, data: any }[]> {
    var returnable = await this.databaseHandlerService.getCards();
    return returnable;
  }

  async updateCardsData() {
    await this.getAllCards().then(cards => {
      this.cards.next(cards);
    }).catch(error => {
      console.error('Error fetching cards:', error);
    });
  }

  async getCardsLength(): Promise<number> {
    await this.updateCardsData();
    return this.cards.value.length;
  }

  // Update the shown cards based on the ones in the db
  async updateShownCards(): Promise<CardInstance[]>{
    // Filling up with all the cards
    await this.getCardsLength().then(num => this.cardInstanceNum = num);
    this.cardInstances = [];
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
      // Filtering by name
      if(this.matchesNameFilter(newCard.Name)){
        this.cardInstances.push(new CardInstance(newCard));
      }
    }
    
    this.cardInstancesOBSVAL.next(this.cardInstances);
    return this.cardInstancesOBSVAL.value;
  }

  matchesNameFilter(cardName?: string): boolean {
    if(!cardName)
      return false;    
    // if no filter then it matches it
    if(!this.inputValueMsg.value || this.inputValueMsg.value === "")
      return true;
    return cardName.toLowerCase().includes(this.inputValueMsg.value.toLowerCase());
  }
}

