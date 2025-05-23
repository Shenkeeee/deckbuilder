import { Card } from './card';

export class CardInstance {
  // Define a property of type Card
  card: Card;

  // Constructor to initialize the card property
  constructor(cardData: Card) {
    this.card = cardData;
  }
}
