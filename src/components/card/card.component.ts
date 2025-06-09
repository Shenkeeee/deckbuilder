import { Component, Input, OnInit } from '@angular/core';
import { CardInstance } from '../../assets/model/card/card-instance';
import { CommonModule } from '@angular/common';
import { Card } from '../../assets/model/card/card';
import { Deck } from '../../assets/model/deck-container/deck';
import { CardHandlerService } from '../../services/card-handler.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CardComponent implements OnInit {
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
      const newCard = { card: cardToAdd, amount: 1 };

      // Track color order
      const color = cardToAdd.Color || '';
      if (color !== 'Multicolor' && !this.cardHandlerService.colorOrder.has(color)) {
        this.cardHandlerService.colorOrder.add(color);
      }

      // Find the correct insert index
      const insertIndex = this.currentDeck.cards.findIndex(existing => {
        const cmp = this.compareSortValues(
          this.getCardSortValue(newCard.card),
          this.getCardSortValue(existing.card)
        );
        return cmp < 0;
      });

      if (insertIndex === -1) {
        this.currentDeck.cards.push(newCard); // add to end
      } else {
        this.currentDeck.cards.splice(insertIndex, 0, newCard); // insert at right position
      }
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

  // 0 → Special cards (Vezető, Szintlépés 2, Szintlépés 3, Spirit)
  // 1 → Everything else -> Then by multicolor, color appearance order, and mana cost
  getCardSortValue(card: Card): number[] {
    const cardType = card.CardType || '';
    const name = card.Name || '';

    // Special cards
    if (cardType === 'Vezető') return [0, 0];
    if (cardType === 'Szintlépés' && name === 'Szintlépés 2') return [0, 1];
    if (cardType === 'Szintlépés' && name === 'Szintlépés 3') return [0, 2];
    if (cardType === 'Spirit') return [0, 3];

    // Regular cards
    const color = card.Color || '';
    const isMulticolor = color === 'Multicolor';
    const colorIndex = isMulticolor ? -1 : [...this.cardHandlerService.colorOrder].indexOf(color);

    const mana = card.ManaCost ?? Infinity;

    return [1, isMulticolor ? 0 : 1, colorIndex, mana];
  }

  compareSortValues(a: number[], b: number[]): number {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const diff = (a[i] ?? 0) - (b[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
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
