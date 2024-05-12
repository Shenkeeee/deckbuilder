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

  addToDeck(card: Card) {
    if (this.cardsNum > this.currentDeck.cards.length) {
      this.currentDeck.cards.push(card);
      this.cardHandlerService.currentDeck.next(this.currentDeck);
    }
    else {
      alert("Telepakoltad a decked!");
    }
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
