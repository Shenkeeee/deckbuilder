import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';
import * as Papa from 'papaparse'; // library for CSV parsing from file
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { saveAs } from 'file-saver'; // Install this package for file saving

// web app's Firebase configuration
const firebaseConfig = environment.firebase;

@Injectable({
  providedIn: 'root',
})
export class DatabaseHandlerService {
  app!: any;
  private db;
  private workDoc = 'dop';
  private flatFilePath = 'assets/data/dop.json';
  private flatFile: any;

  constructor(private http: HttpClient) {
    if (!this.app) {
      this.app = initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
  }

  async getCards(): Promise<{ id: string; data: any }[]> {
    const cards: { id: string; data: any }[] = [];

    // just use the flat file for now
    await this.useFlatFile(cards);
    return cards;
  }

  async useFlatFile(cards: { id: string; data: any }[]) {
    await this.setLocalFile();
    for (let entry of this.flatFile) {
      cards.push({ id: entry.id, data: entry.data });
    }
  }

  async downloadFlatToCurrent() {
    const cardsToUpdateTo = await this.getCards();
    // Convert the cards array to a JSON string
    const updatedData = JSON.stringify(cardsToUpdateTo, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([updatedData], { type: 'application/json' });

    // Trigger file download using saveAs, save it as workDoc is named
    saveAs(blob, this.workDoc);
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

  async deleteDocumentsWithId(id: string): Promise<void> {
    const cardsCollection = collection(this.db, this.workDoc);
    const querySnapshot = await getDocs(cardsCollection);
    const deletePromises: Promise<void>[] = [];

    querySnapshot.forEach((doc) => {
      if (doc.id === id || doc.id.includes(id)) {
        deletePromises.push(this.deleteCard(doc.id));
      }
    });

    await Promise.all(deletePromises);
  }

  async exportFirebaseToJson(
    db: any = this.db,
    collectionName: string = this.workDoc
  ) {
    const data2: { id: string; data: DocumentData }[] = [];
    const cardsCollection = collection(db, collectionName);

    // Fetch all documents from the collection
    const querySnapshot = await getDocs(cardsCollection);
    querySnapshot.forEach((doc) => {
      data2.push({ id: doc.id, data: doc.data() });
    });

    // Convert data to JSON
    const jsonData = JSON.stringify(data2, null, 2);

    // Save JSON to a file
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, `${collectionName}.json`);

    console.log('Data exported successfully!');
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

  // Fetch the JSON data
  async setLocalFile() {
    await this.http
      .get(this.flatFilePath)
      .toPromise()
      .then((data) => (this.flatFile = data));
  }
}
