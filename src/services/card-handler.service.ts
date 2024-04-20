import { Injectable } from '@angular/core';
import { DatabaseHandlerService } from './database-handler.service';
import { Card } from '../main-container/carddata-container/card';
import { CardInstance } from '../main-container/carddata-container/card-instance';
// import { CardContainerComponent } from '../main-container/card-container/card-container.component';

@Injectable({
  providedIn: 'root'
})

export class CardHandlerService {
  availableCards: string[] = []
  allCards: string[] = []

  // for showing
  cardInstances: CardInstance[] = [];
  cardInstanceNum = 20

  constructor(private databaseHandlerService: DatabaseHandlerService) { }

  async getAllCards(): Promise<string[]> {
    var returnable = await this.databaseHandlerService.getCards();
    return returnable
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
      this.allCards = cards
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
      this.availableCards = cards
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
    return this.availableCards.length
  }

  getAllCardsLength(): number {
    this.updateAllCards();
    return this.allCards.length
  }


  // Showing cards
  updateShownCards() {
    // console.log(this.getAvailableCardsLength());
    if (this.getAvailableCardsLength() != 0) {
      this.cardInstanceNum = this.getAvailableCardsLength()
    }

    for (let i = 0; i < this.cardInstanceNum; i++) {
      let newCard: Card = {
        Color: 'Multicolor',
        CardType: 'Varázslat',
        Subtype: 'Sima',
        Name: 'Dreams of Purgatory ' + (i + 1),
        ManaCost: 9,
        PowerToughness: '',
        Ability: 'Ha még nincs 4 Karaktered a Portálban, egy altípussal rendelkező Karaktert a kezedből egyből a Portálba tehetsz. Száműzd ezt a lapot',
        PlusMana: '2 R',
        PlusCardDraw: '2',
        Spirit: 'S3',
        Release: 'dop23/001',
        CardNumber: '',
        ImagePath: "feherszint.png_resize.jpg",
      };
      this.cardInstances.push(new CardInstance(newCard));
    }
    // this.cardContainerComponent.cardInstances = this.cardInstances;
    return this.cardInstances
  }
}
