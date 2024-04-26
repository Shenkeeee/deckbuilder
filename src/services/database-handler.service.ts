import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import * as Papa from 'papaparse'; // Import PapaParse library for CSV parsing


// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHIzSaMt-nvYBaF6ONTT8hSGNwjt97XB4",
  authDomain: "agilisdeckbuilder.firebaseapp.com",
  projectId: "agilisdeckbuilder",
  storageBucket: "agilisdeckbuilder.appspot.com",
  messagingSenderId: "314364670997",
  appId: "1:314364670997:web:77051ac4961f66afb68a1c",
  hostingSite: "agilisdeckbuilder"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root'
})

export class DatabaseHandlerService {
  private db;
  private workDoc = 'dop_2023';

  constructor() {
    this.db = getFirestore();
  }


  async getCards(): Promise<{ id: string, data: any }[]> {
    const cards: { id: string, data: any }[] = [];
    const cardsCollection = collection(this.db, this.workDoc);
    const querySnapshot = await getDocs(cardsCollection)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, data: doc.data() });
        }));;

    return cards;
  }


  async deleteAllCards() {
    const cardsCollection = collection(this.db, this.workDoc);
    await getDocs(cardsCollection)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          this.deleteCard(doc.id);
        }));;
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
      console.error("Error deleting card:", error)
    }
  }


  // Function to upload data from a CSV file to the database
  async uploadDataFromCSV(file: File): Promise<void> {
    const parseConfig = {
      complete: async (results: any) => {
        for (let row of results.data) {
          // Format the data as needed and upload it to the database
          const formattedData = this.formatData(row);
          await this.uploadData(formattedData);
        }
      }
    };
    Papa.parse(file, parseConfig);
  }


  // Function to format the data from CSV row
  formatData(row: any): any {
    return {
      "szin": row[0],
      "laptipus": row[1],
      "altipus": row[2],
      "nev": row[3],
      "mana-koltseg": row[4],
      "tamado-vedo": row[5],
      "kepesseg": row[6],
      "mana+": row[7],
      "laphuzo+": row[8],
      "spirit": row[9],
      "megjelenes": row[10],
      "sorszam": row[11]
    };
  }


  // Function to upload formatted data to the database
  async uploadData(data: any): Promise<void> {
    try {
      const newId = data["sorszam"].replace('/', '-');
      // Upload the data to Firestore
      await setDoc(doc(this.db, this.workDoc, newId), data);
      console.log("Document written with ID ", newId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  initializeApp(){
    initializeApp(firebaseConfig);
  }

}
