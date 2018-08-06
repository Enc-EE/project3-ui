import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from './services/userService';
import { ListRepository } from './repositories/listRepository';
import { List } from './models/list';
import { User } from './models/user';
import { ListItem } from './models/listItem';
import { ListItemRepository } from './repositories/listItemRepository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project3-ui';

  public lists: List[] = [];
  public user: User = new User();
  public selectedList: List = new List();
  public listItems: ListItem[] = [];

  constructor(private _ngZone: NgZone, private userService: UserService, private listRepository: ListRepository, private listItemRepository: ListItemRepository) { }

  ngOnInit(): void {
    this.loginAndReload();
  }

  loginAndReload = () => {
    this.userService.login(() => {
      this._ngZone.run(() => {
        this.reload();
      })
    });
  }

  private updateView = (data: List[]) => {
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
    list.Name = "new List";
    this.listRepository.createList(list).subscribe({
      next: () => {
        this.reload();
      }
    })
  }

  public addListItem() {
    var listItem = new ListItem();
    listItem.Name = "ListItem :)";
    this.listItemRepository.create(this.selectedList.Id, listItem).subscribe({
      next: () => {
        this.reloadListItems();
      }
    })
  }

  public selectedListChanged() {
    this.reloadListItems();
  }
}
