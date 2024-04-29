import { Component, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import { CardHandlerService } from '../../services/card-handler.service';
import { DatabaseHandlerService } from '../../services/database-handler.service';
import { CardEditPopupComponent } from './card-edit-popup/card-edit-popup.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.scss'
})

export class AdminCardsComponent implements OnInit, OnChanges {
  cards?: { id: string; data: any; }[];

  constructor(private cardHandlerService: CardHandlerService, private dialog: MatDialog, private databaseHandlerService: DatabaseHandlerService) { }

  async ngOnInit() {
    this.cardHandlerService.cardsObservable.subscribe(cards => this.cards = cards);
    await this.cardHandlerService.updateCardsData();
  }
  async ngOnChanges() {
    await this.cardHandlerService.updateCardsData();
  }

  modifyCard(cardId: string, updatedData: any): void {
    // change cards in table - even though it would be changed by database too 
    if (this.cards) {
      const cardIndex = this.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1 && this.cards) {
        // Ha találtunk egyezést, akkor frissítjük az adatokat
        this.cards[cardIndex].data = updatedData.data;
      } else {
        console.error('Card not found with id:', cardId);
      }
    }


    // change cards in database
    this.databaseHandlerService.modifyCard(cardId, updatedData);
  }

  deleteCard(cardId: string) {
    // delete cards in table - even though it would be changed by database too - just for the instant update
    if (this.cards) {
      const cardIndex = this.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1 && this.cards) {
        // Ha találtunk egyezést, akkor töröljük az adatokat
        this.cards.splice(cardIndex, 1);
      } else {
        console.error('Card not found with id:', cardId);
      }
    }

    // delete cards in database - currently disabled
    this.databaseHandlerService.deleteCard(cardId);
  }

  // uploadCards(file: File) {
  //   this.databaseHandlerService.uploadDataFromCSV(file);
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // File is selected, you can now process it
      // console.log("uploading is currently disabled")
      this.databaseHandlerService.uploadDataFromCSV(file);
    }
  }

  deleteAllCards(){
    this.databaseHandlerService.deleteAllCards();
  }
  
  openEditPopup(card: any): void {
    const dialogRef = this.dialog.open(CardEditPopupComponent, {
      data: card
    });

    dialogRef.afterClosed().subscribe((updatedData: any) => {
      if (updatedData) {
        this.modifyCard(card.id, updatedData);
      }
    });
  }

  openDeletePopup(card: any): void {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: card
    });

    dialogRef.afterClosed().subscribe((deletedData: any) => {
      if (deletedData) {
        this.deleteCard(card.id);
      }
    });
  }
}
