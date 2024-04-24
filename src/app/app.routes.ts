import { Routes } from '@angular/router';
import { LoginComponent } from '../other-pages/login/login.component';
import { RegisterComponent } from '../other-pages/register/register.component';
import { AppComponent } from './app.component';
import { DecksComponent } from '../other-pages/decks/decks.component';
import { CardListerPageComponent } from './card-lister-page/card-lister-page.component';

export const routes: Routes = [
    {path: '', component: CardListerPageComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'decks', component: DecksComponent}
];
