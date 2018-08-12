import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListRepository } from './repositories/listRepository';
import { UserService } from './services/userService';
import { UserRepository } from './repositories/userRepository';
import { ListItemRepository } from './repositories/listItemRepository';
import { RouterModule } from '../../node_modules/@angular/router';
import { ListItemComponent } from './list-item/list-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [UserRepository, UserService, ListRepository, ListItemRepository],
  bootstrap: [AppComponent]
})
export class AppModule { }
