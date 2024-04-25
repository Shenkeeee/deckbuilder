import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as Papa from 'papaparse'; // Import PapaParse library for CSV parsing

@Injectable({
  providedIn: 'root'
})


export class DatabaseHandlerService {
  private db;

  constructor() {
    this.db = getFirestore();
  }

  async getCards(): Promise<{ id: string, data: any }[]> {
    const cards: { id: string, data: any }[] = [];
    const cardsCollection = collection(this.db, 'dop');
    const querySnapshot = await getDocs(cardsCollection)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, data: doc.data() });
        }));;

    return cards;
  }

  // to be tested - it adds an ID field
  async modifyCard(cardId: string, newData: any): Promise<void> {
    try {
      const docRef = doc(this.db, 'dop', cardId);
      await updateDoc(docRef, newData.data);
      // console.log(docRef);
      console.log(newData);
      console.log(`Card ${cardId} successfully modified.`);
    } catch (error) {
      console.error('Error modifying card:', error);
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'dop', cardId);
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
      Color: row[0],
      CardType: row[1],
      Subtype: row[2],
      Name: row[3],
      ManaCost: row[4],
      PowerToughness: row[5],
      Ability: row[6],
      PlusMana: row[7],
      PlusCardDraw: row[8],
      Spirit: row[9],
      Release: row[10],
      CardNumber: row[11]
    };
  }


  // Function to upload formatted data to the database
  async uploadData(data: any): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, 'dop_2023'), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

}


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