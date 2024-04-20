import { Component } from '@angular/core';
import { CardHandlerService } from '../services/card-handler.service';

@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [],
  templateUrl: './deck-container.component.html',
  styleUrl: './deck-container.component.scss'

})
export class DeckContainerComponent {
  showFilters: boolean = false;
  filtersContainerClass: string = 'hidden';

  constructor(private cardHandlerService: CardHandlerService) { }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    // Control the anim with this
    this.filtersContainerClass = this.showFilters ? 'visible' : 'hidden';
  }

  async updateAvailableCards() {
    await this.cardHandlerService.updateAvailableCards()
    console.log(await this.cardHandlerService.getAvailableCardsLength());
    this.cardHandlerService.updateShownCards();
  }

}

