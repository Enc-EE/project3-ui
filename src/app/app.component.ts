import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from './services/userService';
import { ListRepository } from './repositories/listRepository';
import { List } from './models/list';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project3-ui';

  public lists: List[] = [];
  public user: User = new User();

  constructor(private _ngZone: NgZone, private userService: UserService, private listRepository: ListRepository) { }

  ngOnInit(): void {
    this.reload();
  }

  reload = () => {
    this.userService.login(() => {
      this.listRepository.getLists().subscribe({
        next: this.updateView
      });
    });
  }

  private updateView = (data: List[]) => {
    this._ngZone.run(() => {
      this.user = this.userService.loggedInUser;
      this.lists = data;
    })
  }
}
