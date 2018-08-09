import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from './services/userService';
import { ListRepository } from './repositories/listRepository';
import { List } from './models/list';
import { User } from './models/user';
import { ListItem } from './models/listItem';
import { ListItemRepository } from './repositories/listItemRepository';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from './services/configService';

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

  public lists: List[] = [];
  public user: User = new User();
  public selectedList: List = new List();
  public listItems: ListItem[] = [];
  private skipper = 0;

  constructor(private _ngZone: NgZone, private route: ActivatedRoute, private router: Router, private userService: UserService, private listRepository: ListRepository, private listItemRepository: ListItemRepository) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string) => {
      if (this.skipper == 1) {
        if (fragment) {
          var token = fragment.split(/[&=]/)[1];
          console.log(token);
          ConfigService.token = token;
          this.userService.afterGotToken(() => {
            this.reload();
          });
          this.router.navigate(['/']);
        } else {
          this.userService.login();
        }
      }
      this.skipper++;
    })
  }

  private updateView = (data: List[]) => {
    console.log("update");
    console.log(data);

    this.user = this.userService.loggedInUser;
    this.lists = data;
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
}
