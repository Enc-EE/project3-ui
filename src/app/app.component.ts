import { Component, OnInit, NgZone, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { UserService } from './services/userService';
import { ListRepository } from './repositories/listRepository';
import { List } from './models/list';
import { User } from './models/user';
import { ListItem } from './models/listItem';
import { ListItemRepository } from './repositories/listItemRepository';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from './services/configService';
import { ListItemComponent } from './list-item/list-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project3-ui';
  editingListItem: ListItem;
  editingList: ListItem;
  public editingText: string;

  @ViewChildren(ListItemComponent) items !: QueryList<ListItemComponent>

  public lists: List[] = [];
  public user: User = new User();
  public selectedList: List = new List();
  public listItems: ListItem[] = [];
  private skipper = 0;
  public isLoggedIn = false;

  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private userService: UserService, private listRepository: ListRepository, private listItemRepository: ListItemRepository) { }

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
    if (!this.selectedList.Name && this.lists.length > 0) {
      this.selectedList = this.lists[0];
    }
    this.reloadListItems();
  }

  private reload() {
    this.listRepository.getLists().subscribe({
      next: this.updateView
    });
  }

  private reloadListItems() {
    if (this.selectedList.Id) {
      this.listItemRepository.getAll(this.selectedList.Id).subscribe({
        next: (listItems) => {
          this.listItems = listItems;
        }
      })
    }
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
    this.reloadListItems();
  }

  public deleteListItem(listItem: ListItem) {
    this.listItemRepository.delete(this.selectedList.Id, listItem.Id).subscribe({
      next: () => {
        this.reloadListItems();
      }
    })
  }

  public editListItem(listItem: ListItem) {
    this.editingListItem = listItem;
    this.editingText = this.editingListItem.Name;
    console.log(this.editingListItem.Name);

  }
  public editList(list: List) {
    this.editingList = list;
    this.editingText = this.editingList.Name;
  }

  public doneEdit() {
    if (this.editingList) {
      this.editingList.Name = this.editingText;
      this.listRepository.updateList(this.editingList.Id, this.editingList).subscribe({
        next: () => {
          this.reload();
        }
      });
      this.editingList = null;
    } else if (this.editingListItem) {
      this.editingListItem.Name = this.editingText;
      this.listItemRepository.update(this.selectedList.Id, this.editingListItem.Id, this.editingListItem).subscribe({
        next: () => {
          this.reloadListItems();
        }
      });
      this.editingListItem = null;
    }
    this.editingText = null;
  }

  public removeList() {
    this.listRepository.delete(this.selectedList.Id).subscribe({
      next: () => {
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
}
