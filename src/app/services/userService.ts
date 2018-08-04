import { Injectable } from "../../../node_modules/@angular/core";
import { environment } from "../../environments/environment";

declare let gapi: any;

@Injectable()
export class UserService {
    private auth2: any;
    private token: string;

    public login = (afterLogin: () => void) => {
        this.token = "test";
        if (this.token == null) {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: environment.client_id,
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
                        this.token = authResponseObj.id_token;
                        afterLogin();
                    }
                });
            });
        } else {
            afterLogin();
        }
    }
}