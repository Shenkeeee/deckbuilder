import { Component, OnInit, HostListener } from '@angular/core';
import { CardHandlerService } from '../../../services/card-handler.service';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { Deck } from '../../../assets/model/deck-container/deck';

import { CommonModule } from '@angular/common';
import { Card } from '../../../assets/model/card/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardWithAmount } from '../../../assets/model/deck-container/card-with-amount';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ShowcaseImage } from '../../../components/showcase-image/showcase-image.component';

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
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    ShowcaseImage,
    CdkScrollableModule,
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
  defaultCardSize = 0;

  selectedFormat = 'standard';
  cardsNum!: number;
  selectedCardsNum: number = 0;
  selectedFormatAdditionalLimit = 0;
  selectedCardsAdditional: number = 0;
  formatAdditionalHint = '';

  importedCode: string = '';

  // Filters
  selectedTypes: string[] = [];
  selectedSubTypes: string[] = [];
  selectedReleases: string[] = [];
  selectedManaCosts: string[] = [];
  selectedSpirits: string[] = [];
  selectedManaPlus: string[] = [];
  selectedLaphuzoPlus: string[] = [];
  selectedWinnable: string[] = [];

  hoveredImagePath: string | null = null;
  hovered: string | null = null;

  cardInstancesOBSVALCHILD = 0;

  currentDeck: Deck = { cards: [] };
  isCardDragged = false;

  clickedOnPicture = false;
  clickedImagePath = '';

  isShowcaseVisible = false;

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
    this.cardHandlerService.selectedManaPlusObs.subscribe(
      (selectedManaPlus) => (this.selectedManaPlus = selectedManaPlus)
    );
    this.cardHandlerService.selectedLaphuzoPlusObs.subscribe(
      (selectedLaphuzoPlus) => (this.selectedLaphuzoPlus = selectedLaphuzoPlus)
    );
    this.cardHandlerService.selectedWinnableObs.subscribe(
      (selectedWinnable) => (this.selectedWinnable = selectedWinnable)
    );
    this.cardHandlerService.selectedFormatObs.subscribe((selectedFormat) => {
      this.selectedFormat = selectedFormat;
    });

    this.cardHandlerService.currentDeckObs.subscribe((deck) => {
      this.currentDeck = deck;
      this.updateSelectedCards();
    });
    this.cardHandlerService.selectedFormat.subscribe((format) => {
      this.selectedFormat = format;

      this.updateCardNumber();
      this.selectedFormatAdditionalLimit =
        this.cardHandlerService.selectedFormatAdditionalLimit;
      this.updateFormatAdditionalHint();
    });

    this.getDeckCodeFromUrl();

    this.cardHandlerService.cardInstancesOBSOBS.subscribe(
      (cardInstancesOBSVAL) =>
        (this.cardInstancesOBSVALCHILD = cardInstancesOBSVAL.length)
    );
  }

  updateFormatAdditionalHint() {
    if (this.selectedFormat === 'standard' || this.selectedFormat === 'profi') {
      this.formatAdditionalHint =
        'Extra lapok: 1 vezető - kötelező, 1 spirit, 2 szintlépés kártya';
    }
    if (this.selectedFormat === 'rush') {
      this.formatAdditionalHint = 'Extra lap: 1 vezető - kötelező';
    }
  }

  setDefaultSliderFromCardSize() {
    this.defaultCardSize = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--card-width')
        .trim()
    );
  }

  // makes sure the filters close after you click out of them
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // if filters are not even on, just return
    if (!this.showFilters) {
      return;
    }
    const target = event.target as HTMLElement;
    const isFilterButton = target.closest('#filter-button'); // If the filter button is pressed
    const isFilterContainer = target.closest('.filters-container'); // If they select sg in the filter container

    if (!isFilterButton && !isFilterContainer && this.showFilters) {
      this.showFilters = false;
      this.filtersContainerClass = 'hidden';
    }
  }

  updateCardNumber() {
    this.cardsNum = this.cardHandlerService.updateCardNumber();
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
  }

  updateDeck() {
    this.updateSelectedCards();
    this.cardHandlerService.currentDeck.next(this.currentDeck);
  }

  updateSelectedFormat() {
    this.cardHandlerService.selectedFormat.next(this.selectedFormat);
  }

  updateSelectedCards() {
    // Initialize selectedCardsNum to 0
    this.selectedCardsNum = 0;
    this.selectedCardsAdditional = 0;

    // Iterate through the cards in the deck and accumulate their amounts
    for (const card of this.currentDeck.cards) {
      if (
        card.card.CardType === 'Vezető' ||
        card.card.CardType === 'Szintlépés' ||
        card.card.CardType === 'Spirit'
      ) {
        this.handleAdditionalAdded(card);
      } else {
        // Goes to normal deck
        this.selectedCardsNum += card.amount;
      }
    }
  }

  handleAdditionalAdded(card: CardWithAmount) {
    this.selectedCardsAdditional += card.amount;
  }

  removeFromDeck(cardToRemove: Card) {
    this.changeCardAmount(cardToRemove, false);
  }

  addToDeck(cardToAdd: Card) {
    this.changeCardAmount(cardToAdd, true);
  }

  changeCardAmount(cardToChange: Card, increase: boolean) {
    const indexToRemove = this.currentDeck.cards.findIndex(
      (card) => card.card === cardToChange
    );

    if (indexToRemove === -1) {
      return;
    }

    const card = this.currentDeck.cards[indexToRemove];

    if (increase) {
      // if main deck would be full
      if (
        this.selectedCardsNum >= this.cardsNum &&
        !this.isAdditional(cardToChange)
      ) {
        alert('Elérted az alap pakli maximális számát!');
        return;
      }

      // if additional deck would be full

      // Extra kártyákhoz tartozó ellenőrzés
      const additionalLimits = this.calculateAdditionalLimits();

      if (
        this.isAdditional(cardToChange) &&
        // if these are not true, then throw alert. if they are, card is good
        !(
          (cardToChange.CardType === 'Vezető' && additionalLimits.leader < 1) ||
          (this.selectedFormatAdditionalLimit !== 1 && // ha nem rush módban vagyunk
            cardToChange.CardType === 'Szintlépés' &&
            additionalLimits.levelUp < 2) ||
          (this.selectedFormatAdditionalLimit !== 1 && // ha nem rush módban vagyunk
            cardToChange.CardType === 'Spirit' &&
            additionalLimits.spirit < 1)
        )
      ) {
        alert(cardToChange.CardType + `ből nem adhatsz hozzá többet!`);
        return;
      }

      // no problem, increase
      card.amount++;
    } else {
      // If the amount is greater than one, decrease the amount
      if (card.amount > 1) {
        card.amount--;
      } else {
        // If the amount is one, remove the card from the deck
        this.currentDeck.cards.splice(indexToRemove, 1);

        // Remove the color from the colors in deck if this was the last card with that color
        // Check if any other cards of the same color remain
        const removedColor = card.card.Color;
        const stillExists = this.currentDeck.cards.some(
          (c) => c.card.Color === removedColor
        );

        if (!stillExists && removedColor) {
          this.cardHandlerService.colorOrder.delete(removedColor);
        }
      }
    }

    // Update the deck after modifying it
    this.updateDeck();
  }

  isAdditional(card: Card): boolean {
    return (
      card.CardType === 'Vezető' ||
      card.CardType === 'Szintlépés' ||
      card.CardType === 'Spirit'
    );
  }

  // Segédfüggvény az extra kártyák elosztásának ellenőrzésére
  private calculateAdditionalLimits() {
    let leader = 0;
    let levelUp = 0;
    let spirit = 0;

    for (const card of this.currentDeck.cards) {
      if (card.card.CardType === 'Vezető') {
        leader += card.amount;
      } else if (card.card.CardType === 'Szintlépés') {
        levelUp += card.amount;
      } else if (card.card.CardType === 'Spirit') {
        spirit += card.amount;
      }
    }

    return { leader, levelUp, spirit };
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
    if (!window.confirm('Biztosan kiüríted a paklit?')) {
      return;
    }
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
    parsedData: { id: string; amount: number }[]
  ) {
    const availableCards = await this.cardHandlerService.getAllCards(); // Get the list of all available cards
    // console.log('availableCards ' + JSON.stringify(availableCards));

    return parsedData.map((item) => {
      // console.log('item.id ' + item.id);
      // console.log('card id ' + +availableCards[0]?.data["sorszam"].slice(6));
      const matchingCard = availableCards.find((card) => {
        let sorszam = card.data['sorszam'];

        // Check if the first 3 characters are 3 chars long and "messed up"
        if (sorszam.slice(0, 3) === 'dop' || sorszam.slice(0, 3) === 'Phy') {
          // Remove the 3rd character
          sorszam = sorszam.slice(0, 2) + sorszam.slice(3);
        }

        // Continue with the rest of the logic
        return sorszam.slice(0, 1) + +sorszam.slice(5) === item.id;
      });
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
      return { id: id, amount: parseInt(amount) };
    });
  }

  // Encode deck data
  encodeDeck(deckData: any): string {
    // console.log(deckData);
    // console.log(deckData.cards[0]?.card.CardNumber);

    // have only a compressed id instead of the entire card object
    let compressed = deckData.cards.map(
      (card: { amount: any; card: { CardNumber: any } }) => {
        let cardNumber = card.card.CardNumber;

        // Check if the first 3 characters are 3 chars long and "messed up"
        if (
          cardNumber.slice(0, 3) === 'dop' ||
          cardNumber.slice(0, 3) === 'Phy'
        ) {
          // Remove the 3rd character
          cardNumber = cardNumber.slice(0, 2) + cardNumber.slice(3);
        }

        // Continue with the decoding logic
        return {
          [cardNumber.slice(0, 1) + +cardNumber.slice(5)]: card.amount,
        };
      }
    );
    // console.log('compressed ' + JSON.stringify(compressed));

    // making a string-like object instead of a json-like one
    let compacted = this.compactCards(compressed);
    // console.log('compacted ' + JSON.stringify(compacted));

    const encodedCardData = btoa(JSON.stringify(compacted));
    // console.log('encodedData ' + encodedData);

    const encodedData = this.addFormatToEncoded(encodedCardData);

    return encodedData;
  }

  addFormatToEncoded(encodedCardData: string): string {
    if (!this.selectedFormat.length) {
      return encodedCardData;
    }

    const formattedData = this.selectedFormat[0] + encodedCardData; // Concatenate format and data
    return formattedData;
  }

  getFormatFromEncoded(encodedData: string): string {
    const formatMap: { [key: string]: string } = {
      s: 'standard',
      r: 'rush',
      p: 'profi',
    };

    const formatKey = encodedData.charAt(0); // Get the first character
    this.selectedFormat = formatMap[formatKey] || 'standard'; // Set format based on the key

    this.updateSelectedFormat();

    // Remove the format character from the encoded data
    const encodedCardData = encodedData.slice(1);
    return encodedCardData;
  }

  // Decode deck data
  async decodeDeck(encodedData: string) {
    // this also removes the first character
    const encodedCardData = this.getFormatFromEncoded(encodedData);

    // Decode Base64 string
    let decompressedData = atob(encodedCardData);
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

    // Add the shortened deck code to the URL
    const shortenedUrl = this.addDeckCodeToUrl(deckCode);

    // Use the Clipboard API if supported
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shortenedUrl)
        .then(() => {
          alert('Deck link másolva');
        })
        .catch((error) => {
          // console.error('Failed to copy deck code:', error);
          this.fallbackCopyToClipboard(shortenedUrl);
        });
    } else {
      // Fallback for unsupported browsers
      console.error('Clipboard API not supported');
      this.fallbackCopyToClipboard(shortenedUrl);
    }

    this.router.navigate([], {
      queryParams: {},
    });
  }

  // Fallback function for copying to the clipboard
  fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Prevent scrolling to bottom of the page
    textArea.style.left = '-9999px'; // Move it off-screen
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      alert('Deck link másolva');
    } catch (error) {
      console.error('Fallback copy failed:', error);
    }

    document.body.removeChild(textArea);
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

        // Assign to `currentDeck`
        this.currentDeck = this.normalizeDeckFormat(validCards);

        this.updateDeck();
        this.importedCode = '';
      }
    } catch (error) {
      return;
    }
  }

  addDeckCodeToUrl(deckCode: string | null = null) {
    const baseUrl = window.location.origin + window.location.pathname; // Current domain + path
    const fullUrl = `${baseUrl}?deckCode=${this.importedCode}`;

    this.router.navigate([], {
      queryParams: {
        deckCode: this.importedCode,
      },
    });

    return fullUrl;
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

  onManaPlusChanges(input: string) {
    const index = this.selectedManaPlus.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedManaPlus.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedManaPlus.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changePlusMana();
  }

  onLaphuzasPlusChanges(input: string) {
    const index = this.selectedLaphuzoPlus.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedLaphuzoPlus.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedLaphuzoPlus.splice(index, 1);
    }
    // console.log(this.selectedSubTypes);
    this.changePlusLaphuzo();
  }

  onWinnableChanges(input: string) {
    const index = this.selectedWinnable.indexOf(input);
    if (index === -1) {
      // Ha még nincs a tömbben, akkor hozzáadjuk
      this.selectedWinnable.push(input);
    } else {
      // Ha már benne van a tömbben, akkor kivesszük
      this.selectedWinnable.splice(index, 1);
    }
    // console.log(this.selectedWinnable);
    this.changePlusWinnable();
  }

  changeTypes() {
    this.cardHandlerService.selectedTypes.next(this.selectedTypes);
    this.updateShownCards();
  }

  changeSubTypes() {
    this.cardHandlerService.selectedSubTypes.next(this.selectedSubTypes);
    this.updateShownCards();
  }

  changeReleases() {
    this.cardHandlerService.selectedReleases.next(this.selectedReleases);
    this.updateShownCards();
  }

  changeManaCosts() {
    this.cardHandlerService.selectedManaCosts.next(this.selectedManaCosts);
    this.updateShownCards();
  }

  changeSpirits() {
    this.cardHandlerService.selectedSpirits.next(this.selectedSpirits);
    this.updateShownCards();
  }

  changePlusMana() {
    this.cardHandlerService.selectedManaPlus.next(this.selectedManaPlus);
    this.updateShownCards();
  }

  changePlusLaphuzo() {
    this.cardHandlerService.selectedLaphuzoPlus.next(this.selectedLaphuzoPlus);
    this.updateShownCards();
  }

  changePlusWinnable() {
    this.cardHandlerService.selectedWinnable.next(this.selectedWinnable);
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
            Winnable: card.data.nyeremeny || '',
            // Release: card.data.megjelenes || '',
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

  showHoveredCard(cardImagePath: any) {
    // if any card is being dragged, do not show any hovered card
    if (this.isCardDragged) {
      return;
    }
    this.hoveredImagePath = cardImagePath;
  }

  hideHoveredCard() {
    this.hoveredImagePath = null;
    this.hovered = null;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.currentDeck.cards,
      event.previousIndex,
      event.currentIndex
    );
  }

  onDragStart() {
    this.isCardDragged = true;
  }

  onDragEnd() {
    this.isCardDragged = false;
  }

  clickOnPicture(path?: string) {
    this.hoveredImagePath = '';
    if (!path) {
      this.clickedOnPicture = false;
      this.clickedImagePath = '';
      return;
    }
    this.clickedOnPicture = !this.clickedOnPicture;
    this.clickedImagePath = path;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isShowcaseVisible = false;
    }
  }

  pressedKeys = new Set<string>();

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.pressedKeys.add(event.key.toLowerCase());

    if (
      this.pressedKeys.has('j') &&
      this.pressedKeys.has('l') &&
      this.pressedKeys.has('i')
    ) {
      this.toggleShowcase();
    }

    if (event.key === 'Escape') {
      this.isShowcaseVisible = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key.toLowerCase());
  }

  toggleShowcase() {
    this.isShowcaseVisible = !this.isShowcaseVisible;
  }
}
