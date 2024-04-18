import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainContainerComponent } from "../main-container/main-container.component"
import { NavbarContainerComponent } from "../navbar-container/navbar-container.component"
import { DeckContainerComponent } from "../deck-container/deck-container.component"
import { DeckBuilderComponent } from "../deck-builder/deck-builder.component"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainContainerComponent, NavbarContainerComponent, DeckContainerComponent, DeckBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'deckbuilder';
}
