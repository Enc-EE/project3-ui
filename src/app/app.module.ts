import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ListRepository } from './repositories/listRepository';
import { UserService } from './services/userService';
import { UserRepository } from './repositories/userRepository';
import { ListItemRepository } from './repositories/listItemRepository';
import { RouterModule } from '../../node_modules/@angular/router';
import { ListItemComponent } from './list-item/list-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatButtonModule, MatSelectModule, MatToolbarModule, MatInputModule, MatIconModule, MatDialogModule, MatListModule, MatSlideToggleModule, MatProgressSpinnerModule } from '@angular/material';
import { ListSettingsComponent } from './list-settings/list-settings.component';
import { ListItemGroupRepository } from './repositories/listItemGroupRepository';
import { ListItemGroupSettingsComponent } from './list-item-group-settings/list-item-group-settings.component';
import { ListSharingComponent } from './list-sharing/list-sharing.component';
import { ListSharingRepository } from './repositories/listSharingRepository';

@NgModule({
  declarations: [
    AppComponent,
    ListItemComponent,
    ListSettingsComponent,
    ListItemGroupSettingsComponent,
    ListSharingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [UserRepository, UserService, ListRepository, ListItemRepository, ListItemGroupRepository, ListSharingRepository],
  bootstrap: [AppComponent],
  entryComponents: [ListSettingsComponent, ListItemGroupSettingsComponent, ListSharingComponent]
})
export class AppModule { }
