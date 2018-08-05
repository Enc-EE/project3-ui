import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListRepository } from './repositories/listRepository';
import { UserService } from './services/userService';
import { UserRepository } from './repositories/userRepository';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [UserRepository, UserService, ListRepository],
  bootstrap: [AppComponent]
})
export class AppModule { }
