import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import * as Papa from 'papaparse'; // library for CSV parsing from file
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { DbDexieService } from './dbDexie.service';

// web app's Firebase configuration
const firebaseConfig = environment.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class DatabaseHandlerService {
  app!: any;
  private db;
  // private workDoc = 'dop_2023';
  private workDoc = 'dop';
  private fetchDoc = 'fetch';

  remoteFetchCooldown = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  // remoteFetchCooldown = 60 * 1000; // 1 minute in milliseconds

  user = new BehaviorSubject<any>(getAuth().currentUser);
  userObs = this.user.asObservable();

  constructor(private dbDexieService: DbDexieService) {
    if (!this.app) {
      this.app = initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
    // console.log(getAuth());
    this.user.next(getAuth().currentUser);
  }

  async getCards(): Promise<{ id: string; data: any }[]> {
    const cards: { id: string; data: any }[] = [];
    const currentTime = Date.now();

    // If the IndexedDB has no cards, fetch from the remote source regardless of cooldown
    const indexedDbCards = await this.getIndexedDbCards();
    if (!indexedDbCards || indexedDbCards.length === 0) {
      // getting when firebase was last fetched so that we can set the local to the same
      const { isLocalUpToDate, firebaseLastFetched } =
        await this.isIndexedDbUpToDate();

      console.log('initial remote fetching');
      await this.useFirebase(cards);
      await this.updateIndexedDbCards(cards, firebaseLastFetched);
      return cards;
    }

    // if cooldown is not over yet, dont even check if firebase lastFetchDate is the same,
    // therefore not always using 1 getRequest towards firebase to check fetched date,
    // just in every x hours
    const lastRemoteCheckAttempt =
      await this.dbDexieService.getLastRemoteChecked();
    const isCooldownStillOn =
      lastRemoteCheckAttempt &&
      currentTime - lastRemoteCheckAttempt < this.remoteFetchCooldown;

    if (isCooldownStillOn) {
      this.logRemainingCooldownTime(lastRemoteCheckAttempt, currentTime);
      return await this.useIndexedDb(cards); // Use IndexedDB if within cooldown period
    }

    // check for firebase lastfetchdate === local lastfetchdate
    const { isLocalUpToDate, firebaseLastFetched } =
      await this.isIndexedDbUpToDate();

    console.log('local is up to date: ' + isLocalUpToDate);
    if (isLocalUpToDate) {
      return await this.useIndexedDb(cards);
    } else {
      console.log('fetching remote...');
      await this.useFirebase(cards);
      await this.updateIndexedDbCards(cards, firebaseLastFetched);
    }

    return cards;
  }

  logRemainingCooldownTime(lastFetchAttempt: number, currentTime: number) {
    const cooldownRemaining =
      lastFetchAttempt + this.remoteFetchCooldown - currentTime;
    const hours = Math.floor(cooldownRemaining / (60 * 60 * 1000));
    const minutes = Math.floor(
      (cooldownRemaining % (60 * 60 * 1000)) / (60 * 1000)
    );
    const seconds = Math.floor((cooldownRemaining % (60 * 1000)) / 1000);
    const milliseconds = cooldownRemaining % 1000;

    console.log(
      `Cooldown in effect. Fetch allowed after: ${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`
    );
  }

  async getIndexedDbCards() {
    return await this.dbDexieService.getCards();
  }

  async updateIndexedDbCards(
    cards: { id: string; data: any }[],
    firebaseLastFetched: number | null
  ) {
    await this.dbDexieService.deleteAllCards();
    await this.dbDexieService.addCards(cards);
    await this.dbDexieService.updateLastFetched(firebaseLastFetched);
  }

  async useIndexedDb(cards: { id: string; data: any }[]) {
    // get data from indexedDB
    const indexedDBCards = await this.dbDexieService.getCards();
    if (indexedDBCards !== null && indexedDBCards.length > 0) {
      await this.dbDexieService.getCards().then((cardListIndexedDB) => {
        console.log('fetching IndexedDB');
        cardListIndexedDB.forEach((card: { id: any; data: any }) => {
          cards.push({ id: card.id, data: card.data });
        });
      });
    }
    return cards;
  }

  async useFirebase(cards: { id: string; data: any }[]) {
    const cardsCollection = collection(this.db, this.workDoc);
    await getDocs(cardsCollection).then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        cards.push({ id: doc.id, data: doc.data() });
      })
    );
  }

  async isIndexedDbUpToDate() {
    const docRef = doc(this.db, this.fetchDoc, '/lastFetched');
    const docSnapshot = await getDoc(docRef);

    const lastRemoteCheck = Date.now();
    this.dbDexieService.updateLastRemoteChecked(lastRemoteCheck);

    // log
    const docData = docSnapshot.data();
    if (docData && 'date' in docData) {
      console.log('firebase: ' + +docData['date']);
    }
    console.log('dexie: ' + (await this.dbDexieService.getLastFetched()));

    // if the 2 dates are not matching
    if (
      docSnapshot.exists() &&
      docSnapshot.data() &&
      'date' in docSnapshot.data() &&
      (await this.dbDexieService.getLastFetched()) !==
        +docSnapshot.data()['date']
    ) {
      return {
        isLocalUpToDate: false,
        firebaseLastFetched: +docSnapshot.data()['date'],
      };
    }
    return { isLocalUpToDate: true, firebaseLastFetched: null };
  }

  async updateFirebaseToCurrent() {
    const docRef = doc(this.db, this.fetchDoc, '/lastFetched');
    const currentTime = Date.now();
    await setDoc(docRef, { date: currentTime });
  }

  async deleteAllCards(): Promise<void> {
    const cardsCollection = collection(this.db, this.workDoc);
    const querySnapshot = await getDocs(cardsCollection);
    const deletePromises: Promise<void>[] = [];

    querySnapshot.forEach((doc) => {
      deletePromises.push(this.deleteCard(doc.id));
    });

    await Promise.all(deletePromises);
  }

  // to be tested - it adds an ID field (maybe)
  async modifyCard(cardId: string, newData: any): Promise<void> {
    try {
      const docRef = doc(this.db, this.workDoc, cardId);
      await updateDoc(docRef, newData.data);
      // console.log(newData);
      console.log(`Card ${cardId} successfully modified.`);
    } catch (error) {
      console.error('Error modifying card:', error);
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.workDoc, cardId);
      await deleteDoc(docRef);
      console.log(`Card ${cardId} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }

  // Function to upload data from a CSV file to the database
  async uploadDataFromCSV(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const parseConfig = {
        delimiter: '', // Let PapaParse auto-detect the delimiter
        complete: async (results: any) => {
          try {
            for (let row of results.data) {
              // Format the data as needed and upload it to the database
              const formattedData = this.formatData(row);
              await this.uploadData(formattedData);
            }
            resolve(); // Resolve the promise when all data is uploaded
          } catch (error) {
            reject(error); // Reject the promise if an error occurs
          }
        },
      };
      Papa.parse(file, parseConfig);
    });
  }

  // Function to format the data from CSV row
  formatData(row: any): any {
    return {
      szin: row[0],
      laptipus: row[1],
      altipus: row[2],
      nev: row[3],
      'mana-koltseg': row[4],
      'tamado-vedo': row[5],
      kepesseg: row[6],
      'mana+': row[7],
      'laphuzo+': row[8],
      spirit: row[9],
      sorszam: row[10],
      // megjelenes: row[10],
      // sorszam: row[11] || null,
    };
  }

  // Function to upload formatted data to the database
  async uploadData(data: any): Promise<void> {
    try {
      const newId = data['sorszam'].replace('/', '-');

      // Upload the data to Firestore
      await setDoc(doc(this.db, this.workDoc, newId), data);
      console.log('Document written with ID ', newId);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  initializeApp() {
    initializeApp(firebaseConfig);
  }

  // initializeUser(){
  //   initializeApp(firebaseConfig);
  // }
}
