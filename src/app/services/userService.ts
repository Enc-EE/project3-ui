import { Injectable } from "../../../node_modules/@angular/core";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { UserRepository } from "../repositories/userRepository";
import { ConfigService } from "./configService";

declare let gapi: any;

@Injectable()
export class UserService {
    private auth2: any;
    public loggedInUser: User;

    constructor(private userRepository: UserRepository) { }

    public login = (afterLogin: () => void) => {
        if (ConfigService.token == null) {
            switch (environment.client_id) {
                case 'dev-id':
                    ConfigService.token = 'dev-token'
                    this.afterGotToken(afterLogin);
                    break;
                case 'prod-id':
                    ConfigService.token = 'prod-token'
                    this.afterGotToken(afterLogin);
                    break;
                default:
                    this.gLogin(() => {
                        this.afterGotToken(afterLogin)
                    });
                    break;
            }
        } else {
            this.afterGotToken(afterLogin);
        }
    }

    afterGotToken = (afterLogin: () => void) => {
        this.userRepository.getUser().subscribe({
            next: (data) => {
                this.loggedInUser = data;
                afterLogin();
            }
        })
    }

    private gLogin(afterLogin: () => void) {
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
                    ConfigService.token = authResponseObj.id_token;
                    afterLogin();
                }
            });
        });
    }
}