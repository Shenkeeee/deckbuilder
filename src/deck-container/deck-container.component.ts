import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CardHandlerService } from '../services/card-handler.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deck-container.component.html',
  styleUrl: './deck-container.component.scss'

})
export class DeckContainerComponent implements OnInit {
  showFilters: boolean = false;
  filtersContainerClass: string = 'hidden';
  inputValueMsg=""
  inputValue: string = '';

  constructor(private cardHandlerService: CardHandlerService) { }

  ngOnInit(): void {
    this.cardHandlerService.inputMsgObservable.subscribe(inputValueMsg => this.inputValueMsg = inputValueMsg)
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    // Control the anim with this
    this.filtersContainerClass = this.showFilters ? 'visible' : 'hidden';
  }

  updateAvailableCards() {
    this.cardHandlerService.updateAvailableCardsData();
    // console.log(await this.cardHandlerService.getAvailableCardsLength());
    this.cardHandlerService.updateShownCards();
    this.cardHandlerService.inputValueMsg.next(this.inputValue);
    console.log(this.inputValue);
  }

}

