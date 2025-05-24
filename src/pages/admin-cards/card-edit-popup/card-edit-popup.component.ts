import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
@Component({
  selector: 'app-card-edit-popup',
  templateUrl: './card-edit-popup.component.html',
  styleUrls: ['./card-edit-popup.component.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  standalone: true,
})
export class CardEditPopupComponent implements OnInit {
  editable = true;

  editedCardData: any;

  constructor(
    public dialogRef: MatDialogRef<CardEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public cardData: any
  ) {}

  ngOnInit(): void {
    // Deep Clone cardData to editedCardData
    this.editedCardData = JSON.parse(JSON.stringify(this.cardData));

    this.filterNullValues();
  }

  filterNullValues() {
    for (let key in this.editedCardData.data) {
      if (this.editedCardData.data[key] === 'null') {
        this.editedCardData.data[key] = '';
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
