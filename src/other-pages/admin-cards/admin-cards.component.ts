import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CardHandlerService } from '../../services/card-handler.service';
import { DatabaseHandlerService } from '../../services/database-handler.service';
import { CardEditPopupComponent } from './card-edit-popup/card-edit-popup.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatProgressSpinnerModule,
  MatProgressSpinner,
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressSpinner,
  ],
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.scss',
})
export class AdminCardsComponent {
  cards?: { id: string; data: any }[];
  cardsShown = false;

  constructor(
    private cardHandlerService: CardHandlerService,
    private dialog: MatDialog,
    private databaseHandlerService: DatabaseHandlerService
  ) {}

  modifyCard(cardId: string, updatedData: any): void {
    // change cards in table - even though it would be changed by database too
    if (this.cards) {
      const cardIndex = this.cards.findIndex((card) => card.id === cardId);
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
      const cardIndex = this.cards.findIndex((card) => card.id === cardId);
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
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: file,
      });

      dialogRef.afterClosed().subscribe((uploadable: any) => {
        if (uploadable) {
          const spinnerRef = this.dialog.open(MatProgressSpinner, {
            disableClose: true, // Prevent closing the spinner dialog
            panelClass: 'spinner-overlay', // Apply custom styles for the overlay
          });

          this.databaseHandlerService.uploadDataFromCSV(file).then(
            (resolve) => {
              // Hide the spinner once the upload is complete
              spinnerRef.close();
              // window.location.reload();
            },
            (error: any) => {
              // Handle error if upload fails
              console.error('Error uploading file:', error);
              spinnerRef.close(); // Close the spinner in case of error
            }
          );
        } else {
          event.target.value = null;
        }
      });
    }
  }

  async deleteAllCards() {
    await this.databaseHandlerService.deleteAllCards();
  }

  openEditPopup(card: any): void {
    const dialogRef = this.dialog.open(CardEditPopupComponent, {
      data: card,
    });

    dialogRef.afterClosed().subscribe((updatedData: any) => {
      if (updatedData) {
        this.modifyCard(card.id, updatedData);
      }
    });
  }

  openDeletePopup(card: any): void {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: card,
    });

    dialogRef.afterClosed().subscribe((deletedData: any) => {
      if (deletedData) {
        this.deleteCard(card.id);
      }
    });
  }

  openDeleteAllPopup(card: any): void {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: card,
    });

    dialogRef.afterClosed().subscribe((deletedData: any) => {
      if (deletedData) {
        const spinnerRef = this.dialog.open(MatProgressSpinner, {
          disableClose: true, // Prevent closing the spinner dialog
          panelClass: 'primary-spinner-overlay', // Apply custom styles for the overlay
        });
        this.deleteAllCards().then(
          () => {
            // Hide the spinner once the upload is complete
            spinnerRef.close();
            window.location.reload();
          },
          (error: any) => {
            // Handle error if upload fails
            console.error('Error deleting cards:', error);
            spinnerRef.close(); // Close the spinner in case of error
          }
        );
      }
    });
  }

  async showCards() {
    this.cardsShown = true;

    this.cardHandlerService.cardsObservable.subscribe(
      (cards) => (this.cards = cards)
    );
    await this.cardHandlerService.updateCardsData();
  }

  updateFirebase() {
    this.databaseHandlerService.updateFirebaseToCurrent().then(() => {
      alert('Firebase frissítve!');
    });
  }
}
