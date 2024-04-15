import { Component } from '@angular/core';
import { CarddataContainerComponent } from "../carddata-container/carddata-container.component"
import { CommonModule } from '@angular/common';
import { CardInstance } from "../carddata-container/card-instance";
import { Card } from "../carddata-container/card";

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CarddataContainerComponent, CommonModule],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss'
})


export class CardContainerComponent {
  cardInstances: CardInstance[] = [];

  constructor() {
    for (let i = 0; i < 5; i++) {
      let newCard: Card = {
        Color: 'Multicolor',
        CardType: 'Varázslat',
        Subtype: 'Sima',
        Name: 'Dreams of Purgatory ' + (i + 1),
        ManaCost: 9,
        PowerToughness: '',
        Ability: 'Ha még nincs 4 Karaktered a Portálban, egy altípussal rendelkező Karaktert a kezedből egyből a Portálba tehetsz. Száműzd ezt a lapot',
        PlusMana: '2 R',
        PlusCardDraw: '2',
        Spirit: 'S3',
        Release: 'dop23/001',
        CardNumber: '',
        ImagePath: "feherszint.png_resize.jpg",
      };
      this.cardInstances.push(new CardInstance(newCard));
    }
  }
}