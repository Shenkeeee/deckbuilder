import { Injectable } from '@angular/core';
import { DatabaseHandlerService } from './database-handler.service';
import { Card } from '../main-container/carddata-container/card';
import { CardInstance } from '../main-container/carddata-container/card-instance';
import { BehaviorSubject } from 'rxjs';
import { Deck } from '../deck-container/deck';

@Injectable({
  providedIn: 'root',
})
export class CardHandlerService {
  // allCards: { id: string, data: any }[] = [];

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

  currentDeck = new BehaviorSubject<Deck>({ cards: [] });
  currentDeckObs = this.currentDeck.asObservable();

  // allCards = new BehaviorSubject<{ id: string, data: any }[]>([]);
  // allCardsObservable = this.allCards.asObservable();

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

  // Update the shown cards based on the ones in the db
  async updateShownCards(): Promise<CardInstance[]> {
    // Filling up with all the cards
    if (this.cardInstanceNum === 0) {
      console.log('fetching');
      await this.getCardsLength().then((num) => (this.cardInstanceNum = num));
    }
    this.cardInstances = [];

    for (let i = 0; i < this.cardInstanceNum; i++) {
      let newCard: Card = {
        Color: this.cards.value[i].data['szin'],
        CardType: this.cards.value[i].data['laptipus'],
        Subtype: this.cards.value[i].data['altipus'],
        Name: this.cards.value[i].data['nev'],
        ManaCost: this.cards.value[i].data['mana-koltseg'],
        PowerToughness: this.cards.value[i].data['tamado-vedo'],
        Ability: this.cards.value[i].data['kepesseg'],
        PlusMana: this.cards.value[i].data['mana+'],
        PlusCardDraw: this.cards.value[i].data['laphuzo+'],
        Spirit: this.cards.value[i].data['spirit'],
        Release: this.cards.value[i].data['sorszam'].startsWith('dop')
          ? this.cards.value[i].data['sorszam'].slice(3, 5) // If 'dop', slice from index 3 to 5
          : this.cards.value[i].data['sorszam'].slice(2, 4), // Otherwise, slice from index 2 to 5
        CardNumber: this.cards.value[i].data['sorszam'],
        ImagePath: this.cards.value[i].id,
      };
      // Filtering by name
      if (
        this.matchesNameFilter(newCard.Name) &&
        this.matchesColorFilter(newCard.Color) &&
        this.matchesTypeFilter(newCard.CardType) &&
        this.matchesSubTypeFilter(newCard.Subtype) &&
        this.matchesManaCostsFilter(newCard.ManaCost) &&
        this.matchesReleasesFilter(newCard.Release) &&
        this.matchesSpiritFilter(newCard.Spirit)
      ) {
        this.cardInstances.push(new CardInstance(newCard));
      }
    }

    this.cardInstancesOBSVAL.next(this.cardInstances);
    return this.cardInstancesOBSVAL.value;
  }

  matchesNameFilter(cardName?: string): boolean {
    // if no filter then it matches it
    if (!this.inputValueMsg.value || this.inputValueMsg.value === '')
      return true;
    if (!cardName) return false;
    return cardName
      .toLowerCase()
      .includes(this.inputValueMsg.value.toLowerCase());
  }

  matchesColorFilter(colorName?: string): boolean {
    // if no filter then it matches it
    if (!this.selectedColors.value || this.selectedColors.value.length === 0)
      return true;
    if (!colorName) return false;
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    // console.log(colorName, " : ", this.selectedColors.value);
    return this.selectedColors.value.includes(
      removeAccents(colorName.toLowerCase())
    );
  }

  matchesTypeFilter(type?: string): boolean {
    // console.log(type, " : ", this.selectedTypes.value);
    // if no filter then it matches it
    if (!this.selectedTypes.value || this.selectedTypes.value.length === 0)
      return true;
    if (!type) return false;
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    return this.selectedTypes.value.includes(removeAccents(type.toLowerCase()));
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
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    return this.selectedSubTypes.value.includes(
      removeAccents(input.toLowerCase())
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
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    return this.selectedReleases.value.includes(
      removeAccents(input.toLowerCase())
    );
  }

  matchesManaCostsFilter(input?: number): boolean {
    // if (!input && this.selectedManaCosts.value.includes("-"))
    //   return true;
    // if no filter then it matches it
    if (
      !this.selectedManaCosts.value ||
      this.selectedManaCosts.value.length === 0
    )
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;
    const inputStr = input?.toString();
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    return (
      this.selectedManaCosts.value.includes(
        removeAccents(inputStr.toLowerCase())
      ) ||
      (this.selectedManaCosts.value.includes('8') &&
        removeAccents(inputStr.toLowerCase()) == '9')
    );
  }

  matchesSpiritFilter(input?: string): boolean {
    // if (!input && this.selectedManaCosts.value.includes("-"))
    //   return true;
    // if no filter then it matches it
    if (!this.selectedSpirits.value || this.selectedSpirits.value.length === 0)
      return true;
    // Ha ezen felul nincs input akkor false
    if (!input) return false;
    const inputStr = input?.toString();
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    return this.selectedSpirits.value.includes(
      removeAccents(inputStr.toLowerCase())
    );
  }

  updateCardNumber() {
    if (this.selectedFormat.value === 'standard') {
      return 60;
    }

    if (this.selectedFormat.value === 'rush') {
      return 35;
    }

    if (this.selectedFormat.value === 'dual') {
      return 50;
    }
    return 60;
  }
}
