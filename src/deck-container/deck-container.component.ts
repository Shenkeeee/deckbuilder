import { Component } from '@angular/core';

@Component({
  selector: 'app-deck-container',
  standalone: true,
  imports: [],
  templateUrl: './deck-container.component.html',
  styleUrl: './deck-container.component.scss'
  
})
export class DeckContainerComponent {
  showFilters: boolean = false;
  filtersContainerClass: string = 'hidden'; // Initialize the class to hidden by default

  toggleFilters() {
    this.showFilters = !this.showFilters;
    // Control the anim with this
    this.filtersContainerClass = this.showFilters ? 'visible' : 'hidden'; 
  }
}
