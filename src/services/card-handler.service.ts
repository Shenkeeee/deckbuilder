import { Injectable } from '@angular/core';
import { DatabaseHandlerService } from './database-handler.service';
import { Card } from '../assets/model/carddata-container/card';
import { Deck } from '../assets/model/deck-container/deck';
import { CardInstance } from '../assets/model/carddata-container/card-instance';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardHandlerService {
  // for showing - we need this to update the observable when its fully filled and not fill the observable directly
  cardInstances: CardInstance[] = [];
  allcardInstances: CardInstance[] = [];
  cardInstanceNum = 0;

  // Observables
  // name input field
  inputValueMsg = new BehaviorSubject<string>('');
  inputMsgObservable = this.inputValueMsg.asObservable();

  selectedFormat = new BehaviorSubject<string>('');
  selectedFormatObs = this.selectedFormat.asObservable();
  selectedFormatAdditionalLimit = 0;

  selectedColors = new BehaviorSubject<string[]>([]);
  selectedColorsObs = this.selectedColors.asObservable();

  selectedTypes = new BehaviorSubject<string[]>([]);
  selectedTypesObs = this.selectedTypes.asObservable();

  selectedSubTypes = new BehaviorSubject<string[]>([]);
  selectedSubTypesObs = this.selectedSubTypes.asObservable();

  selectedReleases = new BehaviorSubject<string[]>([]);
  selectedReleasesObs = this.selectedReleases.asObservable();

  selectedManaCosts = new BehaviorSubject<string[]>([]);
  selectedManaCostsObs = this.selectedManaCosts.asObservable();

  selectedSpirits = new BehaviorSubject<string[]>([]);
  selectedSpiritsObs = this.selectedSpirits.asObservable();

  selectedManaPlus = new BehaviorSubject<string[]>([]);
  selectedManaPlusObs = this.selectedManaPlus.asObservable();

  selectedLaphuzoPlus = new BehaviorSubject<string[]>([]);
  selectedLaphuzoPlusObs = this.selectedLaphuzoPlus.asObservable();

  selectedWinnable = new BehaviorSubject<string[]>([]);
  selectedWinnableObs = this.selectedWinnable.asObservable();

  currentDeck = new BehaviorSubject<Deck>({ cards: [] });
  currentDeckObs = this.currentDeck.asObservable();

  // for data of all
  cards = new BehaviorSubject<{ id: string; data: any }[]>([]);
  cardsObservable = this.cards.asObservable();

  // for showing of filtered
  cardInstancesOBSVAL = new BehaviorSubject<CardInstance[]>([]);
  cardInstancesOBSOBS = this.cardInstancesOBSVAL.asObservable();

  constructor(private databaseHandlerService: DatabaseHandlerService) {}

  async getAllCards(): Promise<{ id: string; data: any }[]> {
    var returnable = await this.databaseHandlerService.getCards();
    return returnable;
  }

  async updateCardsData() {
    await this.getAllCards()
      .then((cards) => {
        this.cards.next(cards);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
      });
  }

  async getCardsLength(): Promise<number> {
    await this.updateCardsData();
    return this.cards.value.length;
  }

  // Utility function to remove accents and trim whitespace
  private removeAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // Utility function to check if a filter is applied
  private isFilterApplied(
    filterValue: any[],
    input?: string | number | null
  ): boolean {
    return !filterValue || filterValue.length === 0 || !input;
  }

  // Update the shown cards based on the ones in the db
  async updateShownCards(): Promise<CardInstance[]> {
    if (this.cardInstanceNum === 0) {
      console.log('fetching');
      this.cardInstanceNum = await this.getCardsLength();
    }

    this.cardInstances = this.cards.value
      .slice(0, this.cardInstanceNum)
      .map((card) => this.createCardInstance(card))
      .filter((cardInstance) => this.isCardVisible(cardInstance.card));

    this.cardInstancesOBSVAL.next(this.cardInstances);
    return this.cardInstancesOBSVAL.value;
  }

  // Create a CardInstance from card data
  private createCardInstance(cardInput: any): CardInstance {
    let data = cardInput.data;
    const card = {
      Color: data['szin'],
      CardType: data['laptipus'],
      Subtype: data['altipus'],
      Name: data['nev'],
      ManaCost: data['mana-koltseg'],
      PowerToughness: data['tamado-vedo'],
      Ability: data['kepesseg'],
      PlusMana: data['mana+'],
      PlusCardDraw: data['laphuzo+'],
      Spirit: data['spirit'],
      Winnable: data['nyeremeny'],
      Release:
        data['sorszam'].startsWith('dop') | data['sorszam'].startsWith('Equ')
          ? data['sorszam'].slice(3, 5)
          : data['sorszam'].slice(2, 4),
      CardNumber: data['sorszam'],
      ImagePath: cardInput.id,
    };

    return new CardInstance(card); // Return a new CardInstance
  }

  // Check if the card should be visible based on filters
  private isCardVisible(card: Card): boolean {
    return (
      this.matchesNameFilter(card.Name) &&
      this.matchesColorFilter(card.Color) &&
      this.matchesTypeFilter(card.CardType) &&
      this.matchesSubTypeFilter(card.Subtype) &&
      this.matchesManaCostsFilter(card.ManaCost) &&
      this.matchesReleasesFilter(card.Release) &&
      this.matchesSpiritFilter(card.Spirit) &&
      this.matchesManaPlusFilter(card.PlusMana) &&
      this.matchesLaphuzoPlusFilter(card.PlusCardDraw) &&
      this.matchesWinnableFilter(card.Winnable)
    );
  }

  // Filters
  matchesNameFilter(cardName?: string): boolean {
    const inputValue = this.inputValueMsg.value.toLowerCase();

    // Check if the filter is applied or if cardName is defined and includes the input value
    return (
      this.isFilterApplied([inputValue], cardName) ||
      (cardName?.toLowerCase().includes(inputValue) ?? false)
    );
  }

  matchesColorFilter(colorName?: string): boolean {
    if (!this.selectedColors.value || this.selectedColors.value.length === 0) {
      return true;
    }
    if (!colorName) return false;

    // -----
    // if dual is selected we handle it as a + sign
    const selectedColors = this.selectedColors.value.map((color) =>
      color === 'dual' ? '+' : color
    );

    // Check for dual color logic
    // if searchable has + then it has multiple colors.
    // but if we also have dual selected then we set it to isDual.
    const hasDual = colorName.includes('+');
    const isDual = colorName.includes('+') && selectedColors.includes('+');
    const colorNameLower = this.removeAccents(colorName.toLowerCase());

    const colorArray: any[] = hasDual
      ? colorNameLower.split('+').map((color) => color.trim())
      : [null];

    // Count how many selected colors match the colorArray
    const matchingCount = selectedColors.filter((color) =>
      colorArray.includes(color)
    ).length;

    // if at least 2 colors match and they are both in the card colors
    const matchesSelectedColors = selectedColors.some(
      (color) => colorArray.includes(color) && selectedColors.length > 1
    );

    // If dual is selected or any selected color matches the colorName
    if (matchesSelectedColors && matchingCount >= 2) {
      // console.log(
      //   'Matching Count: ' +
      //     matchingCount +
      //     '   colorArray: ' +
      //     [...colorArray] +
      //     ' \nSelectedColors: ' +
      //     this.selectedColors.value
      // );

      return true;
    }

    // If dual is selected or both selected colors are in the colorName
    if (isDual) {
      // console.log(
      //   'colorArray  ' +
      //     [...colorArray] +
      //     ' \nSelectedColors ' +
      //     this.selectedColors.value
      // );
      return true;
    }

    // Regular color matching
    return selectedColors.includes(this.removeAccents(colorNameLower));
  }

  matchesTypeFilter(input?: string): boolean {
    // console.log(type, " : ", this.selectedTypes.value);
    // if no filter then it matches it
    if (!this.selectedTypes.value || this.selectedTypes.value.length === 0)
      return true;
    if (!input) return false;

    return this.selectedTypes.value.some((type) =>
      this.removeAccents(input.toLowerCase()).includes(
        this.removeAccents(type.toLowerCase())
      )
    );
  }

  matchesSubTypeFilter(input?: string): boolean {
    // console.log(input, " : ", this.selectedSubTypes.value);
    // Ha nincs megadva filter de a "nincs" van kijelölve akkor is listázzon
    if (!input && this.selectedSubTypes.value.includes('-')) return true;
    // if no filter then it matches it
    if (
      !this.selectedSubTypes.value ||
      this.selectedSubTypes.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;

    return this.selectedSubTypes.value.some((subtype) =>
      this.removeAccents(input.toLowerCase()).includes(
        this.removeAccents(subtype.toLowerCase())
      )
    );
  }

  matchesReleasesFilter(input?: string): boolean {
    // console.log(input, ' : ', this.selectedReleases.value);
    if (!input && this.selectedReleases.value.includes('-')) return true;
    // if no filter then it matches it
    if (
      !this.selectedReleases.value ||
      this.selectedReleases.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;

    return this.selectedReleases.value.includes(
      this.removeAccents(input.toLowerCase())
    );
  }

  matchesManaCostsFilter(input?: number): boolean {
    // if no filter then it matches it
    if (
      !this.selectedManaCosts.value ||
      this.selectedManaCosts.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;

    const inputStr = input?.toString();
    const properInput = this.removeAccents(inputStr.toLowerCase());
    return (
      this.selectedManaCosts.value.includes(properInput) ||
      (this.selectedManaCosts.value.includes('7') && properInput === '8') || // if 7 is selected, it can also be 8
      (this.selectedManaCosts.value.includes('7') && properInput === '9') // if 7 is selected, it can also be 9
    );
  }

  matchesSpiritFilter(input?: string): boolean {
    // if no filter then it matches it
    if (!this.selectedSpirits.value || this.selectedSpirits.value.length === 0)
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;
    const inputStr = input?.toString();

    return this.selectedSpirits.value.includes(
      this.removeAccents(inputStr.toLowerCase())
    );
  }

  matchesManaPlusFilter(input?: string): boolean {
    // if no filter then it matches it
    if (
      !this.selectedManaPlus.value ||
      this.selectedManaPlus.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;
    const inputStr = input?.toString();

    return this.selectedManaPlus.value.includes(
      this.removeAccents(inputStr.toLowerCase())
    );
  }

  matchesLaphuzoPlusFilter(input?: string): boolean {
    // if no filter then it matches it
    if (
      !this.selectedLaphuzoPlus.value ||
      this.selectedLaphuzoPlus.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;
    const inputStr = input?.toString();

    return this.selectedLaphuzoPlus.value.includes(
      this.removeAccents(inputStr.toLowerCase())
    );
  }

  matchesWinnableFilter(input?: string): boolean {
    // if no filter then it matches it
    if (
      !this.selectedWinnable.value ||
      this.selectedWinnable.value.length === 0
    )
      return true;

    // Ha ezen felul nincs input akkor false
    if (input == undefined) return false;
    const inputStr = input?.toString();

    return this.selectedWinnable.value.includes(
      this.removeAccents(inputStr.toLowerCase())
    );
  }

  updateCardNumber() {
    if (this.selectedFormat.value === 'standard') {
      this.selectedFormatAdditionalLimit = 4;
      return 50;
    }

    if (this.selectedFormat.value === 'rush') {
      this.selectedFormatAdditionalLimit = 1;
      return 35;
    }

    if (this.selectedFormat.value === 'profi') {
      this.selectedFormatAdditionalLimit = 4;
      return 65;
    }
    return 50;
  }
}
