import { Injectable, OnInit } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { DatabaseHandlerService } from './database-handler.service';

const auth = getAuth();

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnInit {

  constructor(private databaseHandlerService: DatabaseHandlerService) { }

  ngOnInit(): void {
    // this.databaseHandlerService.initializeApp();
  }

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  signOut(): Promise<any>{
    return signOut(auth);
  }

}
