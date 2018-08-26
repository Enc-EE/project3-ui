import { Component, OnInit, Inject } from '@angular/core';
import { ListItemGroup } from '../models/listItemGroup';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  listItemGroup: ListItemGroup;
  delete: boolean;
}

@Component({
  selector: 'app-list-item-group-settings',
  templateUrl: './list-item-group-settings.component.html',
  styleUrls: ['./list-item-group-settings.component.css']
})
export class ListItemGroupSettingsComponent {
  constructor(public dialogRef: MatDialogRef<ListItemGroupSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
