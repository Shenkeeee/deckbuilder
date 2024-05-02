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
  // Name filter
  inputValueMsg=""
  inputValue: string = '';

  selectedFormat = "standard";
  cardsNum!: number;
  
  // Filters
  selectedTypes: string[] = [];
  selectedSubTypes: string[] = [];
  selectedReleases: string[] = [];
  selectedManaCosts: string[] = [];
  selectedSpirits: string[] = [];

  constructor(private cardHandlerService: CardHandlerService) { }

  ngOnInit(): void {
    this.cardHandlerService.inputMsgObservable.subscribe(inputValueMsg => this.inputValueMsg = inputValueMsg)
    this.updateCardNumber();
    this.cardHandlerService.selectedTypesObs.subscribe(selectedTypes => this.selectedTypes = selectedTypes);
    this.cardHandlerService.selectedSubTypesObs.subscribe(selectedSubTypes => this.selectedSubTypes = selectedSubTypes);
    this.cardHandlerService.selectedReleasesObs.subscribe(selectedReleases => this.selectedReleases = selectedReleases);
    this.cardHandlerService.selectedManaCostsObs.subscribe(selectedManaCosts => this.selectedManaCosts = selectedManaCosts);
    this.cardHandlerService.selectedSpiritsObs.subscribe(selectedSpirits => this.selectedSpirits = selectedSpirits);
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
    this.updateShownCards();
    // console.log(this.inputValue);
  }

  onTypeChanges(type: string) {
    const index = this.selectedTypes.indexOf(type);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedTypes.push(type);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedTypes.splice(index, 1);
    }
    // console.log(this.selectedTypes);
    this.changeTypes();
  }


  onSubTypeChanges(input: string) {
    const index = this.selectedSubTypes.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedSubTypes.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedSubTypes.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changeSubTypes();
  }

  onReleaseChanges(input: string) {
    const index = this.selectedReleases.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedReleases.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedReleases.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changeReleases();
  }

  onManaCostChanges(input: string) {
    const index = this.selectedManaCosts.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedManaCosts.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedManaCosts.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changeManaCosts();
  }

  onSpiritChanges(input: string) {
    const index = this.selectedSpirits.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedSpirits.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedSpirits.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changeSpirits();
  }

  
  changeTypes() {
    this.cardHandlerService.selectedTypes.next(this.selectedTypes);
    // console.log("this.selectedTypes:", this.selectedTypes);
    this.updateShownCards();
  }

  changeSubTypes() {
    this.cardHandlerService.selectedSubTypes.next(this.selectedSubTypes);
    // console.log("this.selectedSubTypes:", this.selectedSubTypes);
    this.updateShownCards();
  }

  changeReleases() {
    this.cardHandlerService.selectedReleases.next(this.selectedReleases);
    // console.log("this.selectedSubTypes:", this.selectedSubTypes);
    this.updateShownCards();
  }

  changeManaCosts() {
    this.cardHandlerService.selectedManaCosts.next(this.selectedManaCosts);
    // console.log("this.selectedSubTypes:", this.selectedSubTypes);
    this.updateShownCards();
  }

  changeSpirits() {
    this.cardHandlerService.selectedSpirits.next(this.selectedSpirits);
    // console.log("this.selectedSubTypes:", this.selectedSubTypes);
    this.updateShownCards();
  }

  updateShownCards() {
    this.cardHandlerService.updateShownCards();
  }


}

