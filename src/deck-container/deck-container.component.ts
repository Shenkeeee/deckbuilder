import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input,
  OnChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CardHandlerService } from '../services/card-handler.service';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { Deck } from './deck';

import { CommonModule } from '@angular/common';
import { Card } from '../main-container/carddata-container/card';
import * as pako from 'pako';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardWithAmount } from './card-with-amount';

@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatIcon,
    MatSliderModule,
  ],
  templateUrl: './deck-container.component.html',
  styleUrl: './deck-container.component.scss',
})
export class DeckContainerComponent implements OnInit {
  showFilters: boolean = false;
  filtersContainerClass: string = 'none';
  // Name filter
  inputValueMsg = '';
  inputValue: string = '';
  defaultCardSize = 300;

  selectedFormat = 'standard';
  cardsNum!: number;
  selectedCardsNum: number = 0;

  importedCode: string = '';

  // Filters
  selectedTypes: string[] = [];
  selectedSubTypes: string[] = [];
  selectedReleases: string[] = [];
  selectedManaCosts: string[] = [];
  selectedSpirits: string[] = [];

  currentDeck: Deck = { cards: [] };

  constructor(
    private cardHandlerService: CardHandlerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setDefaultSliderFromCardSize();
    this.selectedFormat = 'standard';
    this.updateSelectedFormat();
    this.cardHandlerService.inputMsgObservable.subscribe(
      (inputValueMsg) => (this.inputValueMsg = inputValueMsg)
    );
    this.updateCardNumber();
    this.cardHandlerService.selectedTypesObs.subscribe(
      (selectedTypes) => (this.selectedTypes = selectedTypes)
    );
    this.cardHandlerService.selectedSubTypesObs.subscribe(
      (selectedSubTypes) => (this.selectedSubTypes = selectedSubTypes)
    );
    this.cardHandlerService.selectedReleasesObs.subscribe(
      (selectedReleases) => (this.selectedReleases = selectedReleases)
    );
    this.cardHandlerService.selectedManaCostsObs.subscribe(
      (selectedManaCosts) => (this.selectedManaCosts = selectedManaCosts)
    );
    this.cardHandlerService.selectedSpiritsObs.subscribe(
      (selectedSpirits) => (this.selectedSpirits = selectedSpirits)
    );
    this.cardHandlerService.selectedFormatObs.subscribe(
      (selectedFormat) => (this.selectedFormat = selectedFormat)
    );

    // this.currentDeck.cards.forEach(element => {
    //   element.
    // });

    this.cardHandlerService.currentDeckObs.subscribe((deck) => {
      this.currentDeck = deck;
      this.updateSelectedCards();
    });
    this.cardHandlerService.selectedFormat.subscribe((format) => {
      this.selectedFormat = format;
      this.updateCardNumber();
    });

    this.getDeckCodeFromUrl();
  }

  setDefaultSliderFromCardSize() {
    this.defaultCardSize = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--card-width')
        .trim()
    );
  }

  updateCardNumber() {
    this.cardsNum = this.cardHandlerService.updateCardNumber();
    // this.cardHandlerService
  }

  updateSelectionFormat() {
    this.cardHandlerService.selectedFormat.next(this.selectedFormat);
    this.updateCardNumber();
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

  updateDeck() {
    this.cardHandlerService.currentDeck.next(this.currentDeck);
    // console.log('currentDeckUpdated \n' + JSON.stringify(this.currentDeck));

    // this.updateShownCards();
    // console.log(this.inputValue);
  }

  updateSelectedFormat() {
    this.cardHandlerService.selectedFormat.next(this.selectedFormat);
  }

  updateSelectedCards() {
    // Initialize selectedCardsNum to 0
    this.selectedCardsNum = 0;

    // Iterate through the cards in the deck and accumulate their amounts
    for (const card of this.currentDeck.cards) {
      this.selectedCardsNum += card.amount;
    }
  }

  removeFromDeck(cardToRemove: Card) {
    const indexToRemove = this.currentDeck.cards.findIndex(
      (card) => card.card === cardToRemove
    );

    if (indexToRemove !== -1) {
      const card = this.currentDeck.cards[indexToRemove];

      // If the amount is greater than one, decrease the amount
      if (card.amount > 1) {
        card.amount--;
      } else {
        // If the amount is one, remove the card from the deck
        this.currentDeck.cards.splice(indexToRemove, 1);
      }

      // Update the deck after modifying it
      this.updateDeck();
    }
  }

  removeAllFromDeck(card: Card) {
    const deletableIndex = this.currentDeck.cards.findIndex(
      (cardo) => card === cardo.card
    );

    if (deletableIndex !== -1) {
      this.currentDeck.cards.splice(deletableIndex, 1);
      this.updateDeck();
    }
  }

  clearDeck() {
    // remove all the url params - deckCode
    this.router.navigate([], {
      queryParams: {},
    });

    this.currentDeck.cards = [];
    this.updateDeck();
  }

  compactCards(cards: { [key: string]: number }[]): string {
    return cards
      .map((card) => {
        const [id, amount] = Object.entries(card)[0];
        return `${id}:${amount}`;
      })
      .join(',');
  }

  async searchCardsByCompressedID(
    parsedData: { id: number; amount: number }[]
  ) {
    const availableCards = await this.cardHandlerService.getAllCards(); // Get the list of all available cards
    // console.log('availableCards ' + JSON.stringify(availableCards));

    return parsedData.map((item) => {
      // console.log('item.id ' + item.id);
      // console.log('card id ' + +availableCards[0]?.data["sorszam"].slice(6));
      const matchingCard = availableCards.find(
        (card) => +card.data['sorszam'].slice(6) === item.id
      );
      if (matchingCard) {
        return { card: matchingCard, amount: item.amount };
      } else {
        return { error: `Card with ID ${item.id} not found` };
      }
    });
  }

  parseCompressedData(data: string) {
    return data.split(',').map((entry) => {
      const [id, amount] = entry.split(':');
      return { id: parseInt(id), amount: parseInt(amount) };
    });
  }

  // Encode deck data
  encodeDeck(deckData: any): string {
    // console.log(deckData);
    // console.log(deckData.cards[0]?.card.CardNumber);

    // have only a compressed id instead of the entire card object
    let compressed = deckData.cards.map(
      (card: { amount: any; card: { CardNumber: any } }) => {
        return { [+card.card.CardNumber.slice(6)]: card.amount };
      }
    );
    // console.log('compressed ' + JSON.stringify(compressed));

    // making a string-like object instead of a json-like one
    let compacted = this.compactCards(compressed);
    // console.log('compacted ' + JSON.stringify(compacted));

    const encodedData = btoa(JSON.stringify(compacted));
    // console.log('encodedData ' + encodedData);

    return encodedData;
  }

  // Decode deck data
  async decodeDeck(encodedData: string) {
    // Decode Base64 string
    let decompressedData = atob(encodedData);
    // console.log('decompressedData ' + JSON.stringify(decompressedData));

    // remove the url safe characters
    decompressedData = decompressedData.slice(1, decompressedData.length - 1);
    // console.log('url safe data ' + JSON.stringify(decompressedData));

    const parsedData = this.parseCompressedData(decompressedData);
    // console.log('Parsed Data:', parsedData);

    let deckData = await this.searchCardsByCompressedID(parsedData).then(
      (result) => {
        return result;
      }
    );
    // console.log('deckData ' + JSON.stringify(deckData));

    return deckData;
  }

  copyDeckCode() {
    const deckCode = this.encodeDeck(this.currentDeck);

    this.importedCode = deckCode;

    // Check if the browser supports the clipboard API
    if (navigator.clipboard) {
      // Use the clipboard API to copy the deck code to the clipboard
      navigator.clipboard
        .writeText(deckCode)
        .then((result) => {
          alert('Deck kód másolva');
        })
        .catch((error) => {
          console.error('Failed to copy deck code:', error);
          // Optionally handle error if copying fails
        });
    } else {
      // Fallback for browsers that do not support the clipboard API
      console.error('Clipboard API not supported');
      // Optionally provide fallback method for copying to clipboard
    }
  }

  async importDeck() {
    if (!this.importedCode) {
      return;
    }

    try {
      const deckData = await this.decodeDeck(this.importedCode);
      if (deckData) {
        this.addDeckCodeToUrl();

        // removing the 'error' entries came from promise
        const validCards = deckData.filter(
          (item: any) => !item.error
        ) as CardWithAmount[];

        // this.currentDeck = deckData;
        // Assign to `currentDeck`
        this.currentDeck = this.normalizeDeckFormat(validCards);

        this.updateDeck();
        this.importedCode = '';
      }
    } catch (error) {
      return;
    }
  }

  addDeckCodeToUrl() {
    this.router.navigate([], {
      queryParams: {
        deckCode: this.importedCode,
      },
    });
  }

  getDeckCodeFromUrl() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.importedCode = params.get('deckCode') ?? this.importedCode;

      let deckData = null;
      if (this.importedCode && this.importedCode !== '') {
        deckData = await this.decodeDeck(this.importedCode);
      }

      if (deckData) {
        // removing the 'error' entries came from promise
        const validCards = deckData.filter(
          (item: any) => !item.error
        ) as CardWithAmount[];

        // normalize cards to the second -"deck" format
        this.currentDeck = this.normalizeDeckFormat(validCards);

        // console.log('currentDeckURLLoad \n' + JSON.stringify(this.currentDeck));
        // this.currentDeck = deckData;
        this.updateDeck();
        this.importedCode = '';
      }
    });
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

  // Method to paste content from the clipboard into the input field
  pasteFromClipboard(): void {
    // Check if the browser supports the clipboard API
    if (navigator.clipboard) {
      // Use the clipboard API to read content from the clipboard
      navigator.clipboard
        .readText()
        .then((clipboardContent) => {
          // Set the content from the clipboard to the importedCode property
          this.importedCode = clipboardContent;
        })
        .catch((error) => {
          console.error('Failed to read content from clipboard:', error);
          // Optionally handle error if reading from clipboard fails
        });
    } else {
      // Fallback for browsers that do not support the clipboard API
      console.error('Clipboard API not supported');
      // Optionally provide fallback method for reading from clipboard
    }
  }

  updateCardWidth(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    document.documentElement.style.setProperty(`--${'card-width'}`, `${value}`);
  }

  normalizeDeckFormat(deck: any): Deck {
    // console.log('deck ' + JSON.stringify(deck));
    return {
      cards: deck.map((cardWithAmount: any) => {
        const { card, amount } = cardWithAmount;

        // Check if the card is in the first format
        if (card.data && card.id) {
          // Transform to the second format
          const normalizedCard = {
            Color: card.data.szin || '',
            CardType: card.data.laptipus || '',
            Subtype: card.data.altipus || '',
            Name: card.data.nev || '',
            ManaCost: card.data['mana-koltseg'] || '',
            PowerToughness: card.data['tamado-vedo'] || '',
            Ability: card.data.kepesseg || '',
            PlusMana: card.data['mana+'] || '',
            PlusCardDraw: card.data['laphuzo+'] || '',
            Spirit: card.data.spirit || '',
            Release: card.data.megjelenes || '',
            CardNumber: card.data.sorszam || '',
            ImagePath: card.id || '',
          };
          return { card: normalizedCard, amount };
        }

        // If it's already in the second format, return as is
        return cardWithAmount;
      }),
    };
  }
}
