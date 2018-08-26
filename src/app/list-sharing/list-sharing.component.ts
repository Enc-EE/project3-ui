import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionListChange } from '@angular/material';
import { ListSharing } from '../models/listSharing';
import { ListSharingRepository } from '../repositories/listSharingRepository';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { UserRepository } from '../repositories/userRepository';

@Component({
  selector: 'app-list-sharing',
  templateUrl: './list-sharing.component.html',
  styleUrls: ['./list-sharing.component.css']
})
export class ListSharingComponent implements OnInit {
  public listSharings: Array<ListSharing>;
  public users: Array<User>;

  constructor(public dialogRef: MatDialogRef<ListSharingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private listSharingsRepository: ListSharingRepository, private userRepository: UserRepository) { }

  ngOnInit(): void {
    this.loadSharings();
  }

  public loadSharings = () => {
    this.listSharingsRepository.getAll(this.data).subscribe({
      next: (sharings) => {
        this.listSharings = sharings;
        this.userRepository.getAll().subscribe({
          next: (users) => {
            this.users = users;
          }
        })
      }
    })
  }

  public add = (user: User) => {
    var sharing = new ListSharing();
    sharing.User = user;
    console.log("add sharing " + sharing);
    console.log(sharing);
    
    this.listSharingsRepository.create(this.data, sharing).subscribe({
      next: this.loadSharings
    });
  }

  public delete = (listSharing: ListSharing) => {
    this.listSharingsRepository.delete(listSharing.List.Id, listSharing.Id).subscribe();
  }

  public isSharingWithUser = (user: User) => {
    return (this.listSharings.find(x => x.User.Id == user.Id));
  }

  public changeSelection = (event: MatSelectionListChange) => {
    if (event.option.selected) {
      this.add(event.option.value)
    } else {
      var sharing = this.listSharings.find(x => x.User.Id = event.option.value.Id)
      if (sharing) {
        this.delete(sharing);
      } else {
        console.log("err201808261839");
      }
    }
  }
}
