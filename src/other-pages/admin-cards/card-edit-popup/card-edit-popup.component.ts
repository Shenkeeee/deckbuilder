import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-card-edit-popup',
  templateUrl: './card-edit-popup.component.html',
  styleUrls: ['./card-edit-popup.component.scss'],
  imports: [FormsModule],
  standalone: true
})
export class CardEditPopupComponent implements OnInit {
  editable = true;

  editedCardData: any;

  constructor(public dialogRef: MatDialogRef<CardEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public cardData: any
  ) {
  }
  
  ngOnInit(): void {
    this.editedCardData = JSON.parse(JSON.stringify(this.cardData));; // Deep Clone cardData to editedCardData
    
    this.filterNullValues();
  }

  
  filterNullValues() {
    for (let key in this.editedCardData.data) {
      if (this.editedCardData.data[key] === "null") {
        this.editedCardData.data[key] = "";
      }
    }
  }


  onSave(): void {
    // A módosított adatokat visszaadom a fő komponensnek
    this.dialogRef.close(this.editedCardData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
