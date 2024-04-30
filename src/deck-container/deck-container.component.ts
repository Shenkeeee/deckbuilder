import { Component, Output, EventEmitter, OnInit, Input, OnChanges } from '@angular/core';
import { CardHandlerService } from '../services/card-handler.service';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [FormsModule, MatChipsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './deck-container.component.html',
  styleUrl: './deck-container.component.scss'

})
export class DeckContainerComponent implements OnInit, OnChanges{
  showFilters: boolean = false;
  filtersContainerClass: string = 'hidden';
  inputValueMsg=""
  inputValue: string = '';

  selectedFormat = "standard";
  cardsNum!: number;

  constructor(private cardHandlerService: CardHandlerService) { }

  ngOnInit(): void {
    this.cardHandlerService.inputMsgObservable.subscribe(inputValueMsg => this.inputValueMsg = inputValueMsg)
    this.updateCardNumber();
  }

  ngOnChanges(): void {
    console.log(this.cardsNum); 
  }

  updateCardNumber() {
    if(this.selectedFormat == "standard") {
      this.cardsNum = 60;
    }

    if(this.selectedFormat == "rush") {
      this.cardsNum = 35;
    }

    if(this.selectedFormat == "dual") {
      this.cardsNum = 50;
    }
    
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

