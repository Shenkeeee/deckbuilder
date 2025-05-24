import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CardHandlerService } from '../../services/card-handler.service';
import { Deck } from '../../assets/model/deck-container/deck';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'showcase-image',
  standalone: true,
  templateUrl: './showcase-image.component.html',
  styleUrl: './showcase-image.component.scss',
  imports: [CardComponent, CommonModule],
})
export class ShowcaseImage implements OnInit {
  currentDeckReversed: Deck = { cards: [] };

  constructor(private cardHandlerService: CardHandlerService) {}

  ngOnInit(): void {
    this.cardHandlerService.currentDeckObs.subscribe((deck) => {
      this.currentDeckReversed = {
        ...deck,
        cards: [...deck.cards].reverse(),
      };
    });
  }
}
