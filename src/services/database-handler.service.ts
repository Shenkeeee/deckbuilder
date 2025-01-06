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

  async getCards(useFirebase = false): Promise<{ id: string; data: any }[]> {
    const cards: { id: string; data: any }[] = [];

    if (!useFirebase) {
      // get data from indexedDB
      const indexedDBCards = await this.dbDexieService.getCards();
      if (indexedDBCards !== null && indexedDBCards.length > 0) {
        await this.dbDexieService.getCards().then((cardListIndexedDB) => {
          console.log('fetching IndexedDB');
          cardListIndexedDB.forEach((card: { id: any; data: any }) => {
            cards.push({ id: card.id, data: card.data });
          });
        });

        return cards;
      }
    }

    // get data from firestore
    const cardsCollection = collection(this.db, this.workDoc);
    await getDocs(cardsCollection).then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        cards.push({ id: doc.id, data: doc.data() });
      })
    );

    if (!useFirebase) {
      // clear and set indexedDB data, since it was not set already
      await this.dbDexieService.deleteAllCards();
      await this.dbDexieService.addCards(cards);
    }
    return cards;
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
      await this.syncIndexedDbToFirestore();
      console.log(`Card ${cardId} successfully modified.`);
    } catch (error) {
      console.error('Error modifying card:', error);
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.workDoc, cardId);
      await deleteDoc(docRef);
      await this.syncIndexedDbToFirestore();
      console.log(`Card ${cardId} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }

  async syncIndexedDbToFirestore() {
    await this.dbDexieService.updateCards(await this.getCards(true));
  }

  // Function to upload data from a CSV file to the database
  async uploadDataFromCSV(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const parseConfig = {
        complete: async (results: any) => {
          try {
            for (let row of results.data) {
              // Format the data as needed and upload it to the database
              const formattedData = this.formatData(row);
              await this.uploadData(formattedData);
            }
            await this.syncIndexedDbToFirestore();
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
