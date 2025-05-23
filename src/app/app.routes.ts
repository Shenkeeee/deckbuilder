import { Routes } from '@angular/router';
import { CardListerPageComponent } from './card-lister-page/card-lister-page.component';
import { AdminCardsComponent } from '../other-pages/admin-cards/admin-cards.component';

export const routes: Routes = [
    {path: 'create', component: CardListerPageComponent},
    {path: '', redirectTo: "/create", pathMatch: 'full'},
    {path: '**', redirectTo: "/create", pathMatch: 'full' },
    // {path: 'admin-cards', component: AdminCardsComponent},
];
