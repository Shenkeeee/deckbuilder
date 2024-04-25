// import { Component } from '@angular/core';
import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss'
})

export class ConfirmPopupComponent implements OnInit {
  editable = true;

  editedCardData: any;

  constructor(public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public cardData: any
  ) {
  }
  
  ngOnInit(): void {
    this.editedCardData = JSON.parse(JSON.stringify(this.cardData));; // Deep Clone cardData to editedCardData
  }


  onConfirm(): void {
    // A módosított adatokat visszaadom a fő komponensnek
    this.dialogRef.close(this.editedCardData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
