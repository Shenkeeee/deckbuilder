import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root',
})

export class DbDexieService extends Dexie {
  db: any;

  constructor() {
    super('cardsDb');
    this.db = new Dexie('cardsDb');
    this.db.version(1).stores({
      cards: '++id, name, age',
    });
  }

  async addCard(user: any) {
    return this.db.cards.add(user);
  }

  async addCards(cards: any[]) {
    return this.db.cards.bulkAdd(cards);
  }

  async getCard(id: number) {
    return this.db.cards.get(id);
  }

  async getCards() {
    return this.db.cards.toArray();
  }

  async deleteCard(id: number) {
    return this.db.cards.delete(id);
  }

  async deleteAllCards() {
    return this.db.cards.clear();
  }

  async updateCard(id: number, user: any) {
    return this.db.cards.update(id, user);
  }

  async updateCards(cards: any[]) {
    return this.db.cards.bulkPut(cards);
  }
}
