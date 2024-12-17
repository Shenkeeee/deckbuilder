import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth} from 'firebase/auth';
import { DatabaseHandlerService } from './database-handler.service';
import { environment } from '../environments/environment';

const auth = getAuth();

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  user: any;

  constructor(private databaseHandlerService: DatabaseHandlerService) {
    //  this.databaseHandlerService.initializeApp();
    this.databaseHandlerService.userObs.subscribe(user => this.user = user);
    // console.log(this.user);
   }

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password).then(currentUser => this.user = currentUser);
  }

  signOut(): Promise<any>{
    return signOut(auth).then(currentUser => this.user = currentUser);
  }

  isLoggedIn() {
    // console.log(auth.currentUser);
    return this.user ? true : false;
  }

  isAdmin() {
    if(this.isLoggedIn() && auth.currentUser?.email === environment.adminEmail) {
      return true
    }
    return false
  }

}
