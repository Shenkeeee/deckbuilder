import { Routes } from '@angular/router';
import { CardListerPageComponent } from '../pages/deck-builder-page/deck-builder-page.component';
import { AdminCardsComponent } from '../pages/admin-cards/admin-cards.component';

export const routes: Routes = [
  { path: 'create', component: CardListerPageComponent },
  { path: '', redirectTo: '/create', pathMatch: 'full' },
  { path: '**', redirectTo: '/create', pathMatch: 'full' },
  //   { path: 'admin-cards', component: AdminCardsComponent },
];
