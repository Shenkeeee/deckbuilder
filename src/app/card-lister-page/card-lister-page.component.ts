import { Component } from '@angular/core';
import { MainContainerComponent } from "../../main-container/main-container.component"
import { DeckContainerComponent } from "../../deck-container/deck-container.component"

@Component({
  selector: 'app-card-lister-page',
  standalone: true,
  imports: [MainContainerComponent, DeckContainerComponent],
  templateUrl: './card-lister-page.component.html',
  styleUrl: './card-lister-page.component.scss'
})
export class CardListerPageComponent {

}
