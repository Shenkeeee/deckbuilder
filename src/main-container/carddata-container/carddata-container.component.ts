import { Component, Input, OnInit } from '@angular/core';
import { CardInstance } from './card-instance';
import { NgFor, CommonModule } from '@angular/common';
import { Card } from './card';
import { CardHandlerService } from '../../services/card-handler.service';
import { Deck } from '../../deck-container/deck';

@Component({
  selector: 'app-carddata-container',
  templateUrl: './carddata-container.component.html',
  styleUrls: ['./carddata-container.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CarddataContainerComponent implements OnInit {
  @Input() cardInstance!: CardInstance;
  currentDeck!: Deck;
  selectedFormat!: string;
  cardsNum!: number;
  selectedCardsNum!: number;
  selectedCardsAdditional = 0;
  clickedCardId: string | null = null;

  constructor(private cardHandlerService: CardHandlerService) {}

  ngOnInit() {
    this.updateCardNumber();
    this.cardHandlerService.currentDeckObs.subscribe(
      (deck) => (this.currentDeck = deck)
    );
    this.cardHandlerService.selectedFormat.subscribe((format) => {
      this.selectedFormat = format;
      this.updateCardNumber();
    });
  }

  updateCardNumber() {
    this.cardsNum = this.cardHandlerService.updateCardNumber();
  }

  addToDeck(cardToAdd: Card) {
    this.calculateLengthOfDeck();
    let selectedFormatAdditionalLimit =
      this.cardHandlerService.selectedFormatAdditionalLimit;

    if (!this.isAdditionalCard(cardToAdd)) {
      // Normál paklihoz tartozó kártya ellenőrzése
      if (this.selectedCardsNum < this.cardsNum) {
        this.addOrUpdateCard(cardToAdd);
      } else {
        alert('Elérted az alap pakli maximális számát!');
      }
    } else {
      // Extra kártyákhoz tartozó ellenőrzés
      const additionalLimits = this.calculateAdditionalLimits();

      if (
        (cardToAdd.CardType === 'Vezető' && additionalLimits.leader < 1) ||
        (selectedFormatAdditionalLimit !== 1 && // ha nem rush módban vagyunk
          cardToAdd.CardType === 'Szintlépés' &&
          additionalLimits.levelUp < 2) ||
        (selectedFormatAdditionalLimit !== 1 && // ha nem rush módban vagyunk
          cardToAdd.CardType === 'Spirit' &&
          additionalLimits.spirit < 1)
      ) {
        this.addOrUpdateCard(cardToAdd);
      } else {
        alert(`${cardToAdd.CardType}ből nem adhatsz hozzá többet!`);
      }
    }
  }

  // Segédfüggvény kártya hozzáadására vagy frissítésére
  private addOrUpdateCard(cardToAdd: Card) {
    const existingCard = this.currentDeck.cards.find(
      (card) => card.card.CardNumber === cardToAdd.CardNumber
    );

    if (existingCard) {
      existingCard.amount++;
    } else {
      this.currentDeck.cards.push({ card: cardToAdd, amount: 1 });
    }

    this.cardHandlerService.currentDeck.next(this.currentDeck);
  }

  // Segédfüggvény az extra kártyák elosztásának ellenőrzésére
  private calculateAdditionalLimits() {
    let leader = 0;
    let levelUp = 0;
    let spirit = 0;

    for (const card of this.currentDeck.cards) {
      if (card.card.CardType === 'Vezető') {
        leader += card.amount;
      } else if (card.card.CardType === 'Szintlépés') {
        levelUp += card.amount;
      } else if (card.card.CardType === 'Spirit') {
        spirit += card.amount;
      }
    }

    return { leader, levelUp, spirit };
  }

  // Segédfüggvény a kártyatípus ellenőrzésére
  isAdditionalCard(card: Card): boolean {
    return (
      card.CardType === 'Vezető' ||
      card.CardType === 'Szintlépés' ||
      card.CardType === 'Spirit'
    );
  }

  calculateLengthOfDeck() {
    this.selectedCardsNum = 0;
    this.selectedCardsAdditional = 0;

    for (const card of this.currentDeck.cards) {
      if (this.isAdditionalCard(card.card)) {
        this.selectedCardsAdditional += card.amount;
      } else {
        this.selectedCardsNum += card.amount;
      }
    }
  }

  highlightCard(cardId?: string) {
    if (!cardId) {
      return;
    }
    this.clickedCardId = cardId;
    setTimeout(() => {
      this.clickedCardId = null; // Remove the highlight after 0.1 seconds
    }, 100); // 0.1 seconds = 100 milliseconds
  }
}
