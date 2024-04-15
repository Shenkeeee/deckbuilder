import { Component } from '@angular/core';
import { CardContainerComponent } from "./card-container/card-container.component"

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CardContainerComponent],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {

}
