import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { List } from '../models/list';

export interface DialogData {
  list: List;
  delete: boolean;
}

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.css']
})
export class ListSettingsComponent {
  constructor(public dialogRef: MatDialogRef<ListSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
