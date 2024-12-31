import { Routes } from '@angular/router';
import { CardListerPageComponent } from './card-lister-page/card-lister-page.component';
import { LoginComponent } from '../other-pages/login/login.component';
import { RegisterComponent } from '../other-pages/register/register.component';
import { DecksComponent } from '../other-pages/decks/decks.component';
import { AdminCardsComponent } from '../other-pages/admin-cards/admin-cards.component';
import { AdminUsersComponent } from '../other-pages/admin-users/admin-users.component';
import { AuthGuard } from '../services/authGuards/auth-guard';
import { AdminAuthGuard } from '../services/authGuards/auth-guard-admin';
import { GuestAuthGuard } from '../services/authGuards/auth-guard-guest';
import { RootAuthGuard } from '../services/authGuards/auth-guard-root';

export const routes: Routes = [
    {path: 'create', component: CardListerPageComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent, canActivate: [GuestAuthGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestAuthGuard]},
    {path: 'decks', component: DecksComponent, canActivate: [AuthGuard]},
    {path: 'admin-cards', component: AdminCardsComponent, canActivate: [AdminAuthGuard]},
    {path: 'admin-users', component: AdminUsersComponent, canActivate: [AdminAuthGuard]},
    {path: '', canActivate: [RootAuthGuard], component: LoginComponent}, // example component, routing happens in navigation
    {path: '**', canActivate: [RootAuthGuard], component: LoginComponent }
];
