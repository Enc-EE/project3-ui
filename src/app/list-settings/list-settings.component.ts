import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  rename: string;
  delete: boolean;
}

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.css']
})
export class ListSettingsComponent {
  public name: string;
  public static delete = "#?delete";
  public deleteIt = "#?delete";

  constructor(public dialogRef: MatDialogRef<ListSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.name = data.rename;
  }
}
