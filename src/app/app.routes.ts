import { Routes } from '@angular/router';
import { LoginComponent } from '../other-pages/login/login.component';
import { RegisterComponent } from '../other-pages/register/register.component';
import { AppComponent } from './app.component';
import { DecksComponent } from '../other-pages/decks/decks.component';
import { CardListerPageComponent } from './card-lister-page/card-lister-page.component';
import { AdminCardsComponent } from '../other-pages/admin-cards/admin-cards.component';
import { AdminUsersComponent } from '../other-pages/admin-users/admin-users.component';

export const routes: Routes = [
    {path: '', component: CardListerPageComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'decks', component: DecksComponent},
    {path: 'admin-cards', component: AdminCardsComponent},
    {path: 'admin-users', component: AdminUsersComponent},
];
