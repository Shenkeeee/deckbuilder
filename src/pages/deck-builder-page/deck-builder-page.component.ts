import { Component } from '@angular/core';
import { DeckContainerComponent } from "./deck-container/deck-container.component"
import { CardBrowserComponent } from './card-browser/card-browser.component';

@Component({
  selector: 'app-card-lister-page',
  standalone: true,
  imports: [DeckContainerComponent, CardBrowserComponent],
  templateUrl: './deck-builder-page.component.html',
  styleUrl: './deck-builder-page.component.scss'
})
export class CardListerPageComponent {

}
