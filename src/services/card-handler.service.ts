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
  // availableCards: string[] = []
  allCards: { id: string, data: any }[] = [];

  // for showing
  cardInstances: CardInstance[] = [];
  cardInstanceNum = 20
  // observable
  inputValueMsg = new BehaviorSubject<string>("def");
  inputMsgObservable = this.inputValueMsg.asObservable();
  cards = new BehaviorSubject<{ id: string, data: any }[]>([]);
  cardsObservable = this.cards.asObservable();
  cardInstancesOBSVAL = new BehaviorSubject<CardInstance[]>([]);
  cardInstancesOBSOBS = this.cardInstancesOBSVAL.asObservable();

  constructor(private databaseHandlerService: DatabaseHandlerService) { }

  async getAllCards(): Promise<{ id: string, data: any }[]> {
    var returnable = await this.databaseHandlerService.getCards();
    return returnable;
  }

  getAllCardsAsCards(): string[] {
    this.databaseHandlerService.getCards().then(cards => {
      return cards;
    }).catch(error => {
      console.error('Error fetching cards:', error);
    });
    return [];
  }

  updateAllCards(): string[] {
    this.databaseHandlerService.getCards().then(cards => {
      this.allCards = cards;
      // console.log("updateAllcards:");
      // console.log(this.allCards);
      return cards;
    }).catch(error => {
      console.error('Error fetching cards:', error);
    });
    return [];
  }

  updateAvailableCards(): string[] {
    this.getAllCards().then(cards => {
      // this.availableCards = cards

      this.cards.next(cards);
      this.updateShownCards();
      // console.log("updateAvailableCards:");
      // console.log(this.availableCards);
      return cards;
    }).catch(error => {
      console.error('Error fetching cards:', error);
    });
    return []
  }

  getAvailableCardsLength(): number {
    this.updateAvailableCards();
    return this.allCards.length;
  }

  getAvailableCardsOBSLength(): number {
    this.updateAvailableCards();
    return this.cards.value.length;
  }

  getAllCardsLength(): number {
    this.updateAllCards();
    return this.allCards.length;
  }

  updateShownCards(){
    this.cardInstances = [];

    // if (this.getAvailableCardsOBSLength() != 0) {
    //   this.cardInstanceNum = this.getAvailableCardsOBSLength();
    // }

    for (let i = 0; i < this.cards.value.length; i++) {
      // console.log("card", this.cards.value);
      // console.log("0:", this.cards.value[0].data["laphuzo+"]);
      // console.log("1:", this.cards.value[1]);
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
      this.cardInstancesOBSVAL.next(this.cardInstances);
    }
    return this.cardInstances;
  }


  // Showing cards
  // updateShownCards() {
  //   // console.log(this.getAvailableCardsOBSLength());
  //   if (this.getAvailableCardsOBSLength() != 0) {
  //     this.cardInstanceNum = this.getAvailableCardsOBSLength()
  //   }
  //   this.cardInstances = [];
  //   for (let i = 0; i < this.cardInstanceNum; i++) {
  //     let newCard: Card = {
  //       // Color: this.cardInstancesOBSVAL.value.at(i)?.card.Color,
  //       Color: "Multi",
  //       CardType: 'Varázslat',
  //       Subtype: 'Sima',
  //       Name: 'Dreams of Purgatory ' + (i + 1),
  //       ManaCost: 9,
  //       PowerToughness: '',
  //       Ability: 'Ha még nincs 4 Karaktered a Portálban, egy altípussal rendelkező Karaktert a kezedből egyből a Portálba tehetsz. Száműzd ezt a lapot',
  //       PlusMana: '2 R',
  //       PlusCardDraw: '2',
  //       Spirit: 'S3',
  //       Release: 'dop23/001',
  //       CardNumber: '',
  //       ImagePath: "feherszint.png_resize.jpg",
  //     };
  //     this.cardInstances.push(new CardInstance(newCard));
  //   }
  //   // console.log(this.cardInstancesOBSVAL.value);
  //   console.log(this.cardInstancesOBSVAL.value.at(1));

  //   // this.cardInstancesOBSVAL.next(this.cardInstances);
  //   return this.cardInstances;
  // }
}

