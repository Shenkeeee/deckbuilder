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
      fetched: 'date',
      // remoteChecked: 'lastRemoteCheckedDate'
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

  async getLastFetched() {
    let lastFetched = await this.db.fetched.toArray();
    if (lastFetched.length === 0) {
      // If no entry exists, create it with the current time
      await this.db.fetched.put({ date: Date.now() }, 0);
      return Date.now(); // Return the current timestamp
    } else {
      lastFetched = lastFetched.splice(lastFetched.length-1);
      
      // If entry exists, return the date value
      return lastFetched[0].date;
    }
  }

  async updateLastFetched(flatLastFetched: number | null) {
    console.log("local last fetched updated to " + flatLastFetched);
    return await this.db.fetched.put({ date: flatLastFetched }, 0);
  }

  // async getLastRemoteChecked() {
  //   let lastRemoteChecked = await this.db.remoteChecked.toArray();
  //   if (lastRemoteChecked.length === 0) {
  //     // If no entry exists, create it with the current time
  //     await this.db.remoteChecked.put({ lastRemoteCheckedDate: Date.now() }, 0);
  //     return Date.now(); // Return the current timestamp
  //   } else {
  //     lastRemoteChecked = lastRemoteChecked.splice(lastRemoteChecked.length-1);
      
  //     // If entry exists, return the date value
  //     return lastRemoteChecked[0].lastRemoteCheckedDate;
  //   }
  // }

  // async updateLastRemoteChecked(firebaselastRemoteChecked: number | null) {
  //   console.log("local last checked updated to " + firebaselastRemoteChecked);
  //   return await this.db.remoteChecked.put({ lastRemoteCheckedDate: firebaselastRemoteChecked }, 0);
  // }
}
