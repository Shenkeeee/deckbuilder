import { Component, Input, OnInit } from '@angular/core';
import { CardInstance } from "./card-instance"
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

  constructor(private cardHandlerService: CardHandlerService) {

  }

  ngOnInit() {
    this.updateCardNumber();
    this.cardHandlerService.currentDeckObs.subscribe(deck => this.currentDeck = deck);
    this.cardHandlerService.selectedFormat.subscribe(format => {
      this.selectedFormat = format;
      this.updateCardNumber();
    });
  }

  updateCardNumber() {
    this.cardsNum = this.cardHandlerService.updateCardNumber();
  }

  addToDeck(cardToAdd: Card) {
    if (this.cardsNum > this.calculateLengthOfDeck()) {
      // Check if the card is already in the deck
      const existingCard = this.currentDeck.cards.find(card => card.card.CardNumber === cardToAdd.CardNumber);

      if (existingCard) {
        // If the card exists in the deck, increment its amount
        existingCard.amount++;
      } else {
        // If the card doesn't exist in the deck, add it with an amount of 1
        this.currentDeck.cards.push({ card: cardToAdd, amount: 1 });
      }

      // Notify subscribers of the updated deck
      this.cardHandlerService.currentDeck.next(this.currentDeck);
    }
    else {
      alert("Telepakoltad a decked!");
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
  
  // this is also implemented in the deck container component ts
  calculateLengthOfDeck() {
    // Initialize selectedCardsNum to 0
    this.selectedCardsNum = 0;

    // Iterate through the cards in the deck and accumulate their amounts
    for (const card of this.currentDeck.cards) {
      this.selectedCardsNum += card.amount;
    }
    return this.selectedCardsNum;
  }

}
