import { Component, OnInit } from '@angular/core';
import { CardHandlerService } from '../../services/card-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.scss'
})

export class AdminCardsComponent implements OnInit {
  cards?: { id: string; data: any; }[];

  constructor(private cardHandlerService: CardHandlerService) { }
  
  async ngOnInit() {
    this.cardHandlerService.cardsObservable.subscribe(cards => this.cards = cards);
    await this.cardHandlerService.updateCardsData();
  }
}
