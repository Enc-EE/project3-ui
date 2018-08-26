import { Component, OnInit, NgZone, ViewChildren, QueryList, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { UserService } from './services/userService';
import { ListRepository } from './repositories/listRepository';
import { List } from './models/list';
import { User } from './models/user';
import { ListItem } from './models/listItem';
import { ListItemRepository } from './repositories/listItemRepository';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from './services/configService';
import { ListItemComponent } from './list-item/list-item.component';
import { MatDialog, MatSelectionListChange, MatSelectionList } from '@angular/material';
import { ListSettingsComponent } from './list-settings/list-settings.component';
import { ListItemGroup } from './models/listItemGroup';
import { ListItemGroupRepository } from './repositories/listItemGroupRepository';
import { ListItemGroupSettingsComponent } from './list-item-group-settings/list-item-group-settings.component';
import { ListSharingComponent } from './list-sharing/list-sharing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project3-ui';

  @ViewChild('listNameEditor') listNameEditor: ElementRef;
  public isListNameEditing = false;
  public listNameEditorText: string;

  @ViewChildren(ListItemComponent) items !: QueryList<ListItemComponent>

  public lists: List[] = [];
  public user: User = new User();
  public selectedList: List;
  public listItems: ListItem[] = [];
  public groupedListItems: Array<ListItemGroup> = [];
  private skipper = 0;
  public isLoggedIn = false;

  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private userService: UserService, private listRepository: ListRepository, private listItemRepository: ListItemRepository, private listItemGroupRepository: ListItemGroupRepository) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string) => {
      if (this.skipper == 1) {
        if (fragment) {
          var token = fragment.split(/[&=]/)[1];
          ConfigService.token = token;
          this.isLoggedIn = true;
          this.userService.afterGotToken(() => {
            this.reload();
          });
          this.router.navigate(['/']);
        }
      }
      this.skipper++;
    });
  }

  public login() {
    this.userService.login();
  }

  private updateView = (data: List[]) => {
    this.user = this.userService.loggedInUser;
    this.lists = data;

    if (this.selectedList) {
      var selectedId = this.selectedList.Id;
      this.selectedList = this.lists.find(x => x.Id == selectedId);
    }

    if (!this.selectedList && this.lists.length > 0) {
      this.selectedList = this.lists[0];
    }
    this.reloadListItems();
  }

  private reload = () => {
    this.listRepository.getLists().subscribe({
      next: this.updateView
    });
  }

  private reloadListItems() {
    if (this.selectedList && this.selectedList.Id) {
      if (this.selectedList.IsGroupingEnabled) {
        this.listItemGroupRepository.getAll(this.selectedList.Id).subscribe({
          next: (listItemGroups) => {
            this.groupedListItems = listItemGroups;
          }
        })
      } else {
        this.listItemRepository.getAll(this.selectedList.Id).subscribe({
          next: (listItems) => {
            this.listItems = listItems;
          }
        })
      }
    }
  }

  public addGroup = () => {
    const group = new ListItemGroup();
    group.Name = "group";
    this.listItemGroupRepository.create(this.selectedList.Id, group).subscribe({
      next: this.reload
    });
  }

  public addNewGrouped = (listItemGroup: ListItemGroup) => {
    var listItem = new ListItem();
    listItem.Name = "ListItem :) " + (this.listItems.length + 1);
    listItem.ListItemGroup = listItemGroup;
    this.listItemRepository.create(this.selectedList.Id, listItem).subscribe({
      next: () => {
        this.reloadListItems();
      }
    })
  }

  public addList() {
    var list = new List();
    list.Name = "new List " + (this.lists.length + 1);
    this.listRepository.createList(list).subscribe({
      next: () => {
        this.reload();
      }
    })
  }

  public addListItem() {
    var listItem = new ListItem();
    listItem.Name = "ListItem :) " + (this.listItems.length + 1);
    this.listItemRepository.create(this.selectedList.Id, listItem).subscribe({
      next: () => {
        this.reloadListItems();
      }
    })
  }

  public selectedListChanged() {
    console.log(this.selectedList.Name);
    this.reloadListItems();
  }

  public deleteListItem(listItem: ListItem) {
    this.listItemRepository.delete(this.selectedList.Id, listItem.Id).subscribe({
      next: () => {
        this.reloadListItems();
      }
    })
  }

  public removeList() {
    this.listRepository.delete(this.selectedList.Id).subscribe({
      next: () => {
        this.selectedList = null;
        this.reload();
      }
    });
  }

  public updateListItem(listItem: ListItem, event: string) {
    if (!listItem.Id) {
      listItem.Name = event;
      this.listItemRepository.create(this.selectedList.Id, listItem).subscribe({
        next: () => {
          this.reloadListItems();
        }
      })
    } else {
      listItem.Name = event;
      this.listItemRepository.update(this.selectedList.Id, listItem.Id, listItem).subscribe({
        next: () => {
          this.reloadListItems();
        }
      });
    }
  }

  public editNext(listItem: ListItem) {
    var index = this.listItems.indexOf(listItem);

    if (index < this.listItems.length - 1) {
      this.items.toArray()[index + 1].edit();
    } else {
      this.addNew();
    }
  }

  public addNew() {
    setTimeout(() => {
      var listItem = new ListItem();
      this.listItems.push(listItem);
      this.cd.detectChanges();
      setTimeout(() => {
        this.items.last.edit();
      }, 300);
    }, 300);
  }

  public stop(listItem: ListItem, event: string) {
    if (!event && !listItem.Id) {
      var index = this.listItems.indexOf(listItem);
      if (index == this.listItems.length - 1) {
        this.listItems.pop();
      }
    }
  }

  public keyUp(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.endEdit();
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  }

  public endEdit() {
    this.isListNameEditing = false;
    if (this.listNameEditorText != this.selectedList.Name) {
      this.selectedList.Name = this.listNameEditorText;
      this.listRepository.updateList(this.selectedList.Id, this.selectedList).subscribe({
        next: () => {
          this.reload();
        }
      });
    }
  }

  public settings() {
    const dialogRef = this.dialog.open(ListSettingsComponent, {
      width: '250px',
      data: { list: this.selectedList, delete: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.removeList();
        } else {
          this.listRepository.updateList(this.selectedList.Id, this.selectedList).subscribe({
            next: () => {
              this.reload();
            }
          });
        }
      }
    });
  }

  public organize = () => {
    if (this.selectedList.IsGroupingEnabled) {
      for (let i = 0; i < this.groupedListItems.length; i++) {
        const groupedListItem = this.groupedListItems[i];
        for (let j = 0; j < groupedListItem.ListItems.length; j++) {
          const listItem = groupedListItem.ListItems[j];
          if (listItem.IsSelected) {
            this.deleteListItem(listItem);
          }
        }
      }
    } else {
      for (let i = 0; i < this.listItems.length; i++) {
        const listItem = this.listItems[i];
        if (listItem.IsSelected) {
          this.deleteListItem(listItem);
        }
      }
    }
  }

  public groupSettings(listItemGroup: ListItemGroup) {
    const dialogRef = this.dialog.open(ListItemGroupSettingsComponent, {
      width: '250px',
      data: { listItemGroup: listItemGroup, delete: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.listItemGroupRepository.delete(this.selectedList.Id, listItemGroup.Id).subscribe({
            next: () => {
              this.reload();
            }
          });
        } else {
          this.listItemGroupRepository.update(this.selectedList.Id, listItemGroup.Id, listItemGroup).subscribe({
            next: () => {
              this.reload();
            }
          });
        }
      }
    });
  }

  public share = () => {
    const dialogRef = this.dialog.open(ListSharingComponent, {
      width: '250px',
      data: this.selectedList.Id
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
