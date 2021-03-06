import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ListItem } from '../models/listItem';
import { ListItemRepository } from '../repositories/listItemRepository';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input() text: string;
  @Output() update = new EventEmitter<string>();
  @Output() remove = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() stop = new EventEmitter();
  @ViewChild('editor') editor: ElementRef;

  @Input() listItem: ListItem;
  @Input() listItd: number;
  public editingText: string;
  public isEditing = false;

  constructor(private listItemRepository: ListItemRepository) { }

  ngOnInit() {
  }

  public edit() {
    this.editingText = this.text
    this.isEditing = true;
    setTimeout(() => {
      this.editor.nativeElement.focus();
    }, 200);
  }

  public removeItem() {
    this.remove.emit();
  }

  public keyUp(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.endEdit();
      this.next.emit();
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  }

  public endEdit() {
    this.isEditing = false;
    if (this.editingText != this.text) {
      this.text = this.editingText;
      this.update.emit(this.text);
    } else {
      this.stop.emit(this.editingText);
    }
  }

  public done() {
    this.listItem.IsSelected = !this.listItem.IsSelected;
    this.listItemRepository.update(this.listItd, this.listItem.Id, this.listItem).subscribe();
  }
}
