import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));




  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
console.log(analytics);