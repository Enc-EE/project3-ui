import { Component } from '@angular/core';

declare let gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project3-ui';
  private auth2: any;

  login = () => {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '...',
        scope: 'email'
      });
      this.auth2.signIn().then(() => {
        if (this.auth2.isSignedIn.get()) {
          let profile = this.auth2.currentUser.get().getBasicProfile();
          let authResponseObj = this.auth2.currentUser.get().getAuthResponse(true);
          console.log(profile.getId());
          console.log(profile.getName());
          console.log(profile.getEmail());
          console.log(profile.getImageUrl());
          console.log(authResponseObj.access_token);
          console.log(authResponseObj.id_token);
        }
      });
    });
  }
}
