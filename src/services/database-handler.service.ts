import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})


export class DatabaseHandlerService {
  private db;

  constructor() {
    this.db = getFirestore();
  }

  async getCards() {
    const cards = [];
    cards.push("0");
    const cardsCollection = collection(this.db, 'dop');
    const querySnapshot = await getDocs(cardsCollection)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, data: doc.data() });
        }));;

    cards.splice(0, 1)
    // console.log(cards)
    return cards
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