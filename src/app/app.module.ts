import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListRepository } from './repositories/listRepository';
import { UserService } from './services/userService';
import { UserRepository } from './repositories/userRepository';
import { ListItemRepository } from './repositories/listItemRepository';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserRepository, UserService, ListRepository, ListItemRepository],
  bootstrap: [AppComponent]
})
export class AppModule { }
