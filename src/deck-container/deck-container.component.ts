import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CardHandlerService } from '../services/card-handler.service';
import { FormsModule, NgModel } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [FormsModule, MatChipsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
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
    this.cardHandlerService.inputValueMsg.next(this.inputValue);
    this.cardHandlerService.updateShownCards();
    // console.log(this.inputValue);
  }

}

