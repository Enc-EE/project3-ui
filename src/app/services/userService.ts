import { Injectable } from "../../../node_modules/@angular/core";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { UserRepository } from "../repositories/userRepository";
import { ConfigService } from "./configService";
import { Router } from "../../../node_modules/@angular/router";

declare let gapi: any;

@Injectable()
export class UserService {
    private auth2: any;
    public loggedInUser: User;

    constructor(private router: Router, private userRepository: UserRepository) { }

    public login = () => {
        console.log("Login");

        if (ConfigService.token == null) {
            switch (environment.client_id) {
                case 'dev-id':
                    window.location.href = window.location.href + '#id_token=dev-token';
                    location.reload();
                    break;
                case 'prod-id':
                    window.location.href = window.location.href + '#id_token=prod-token';
                    location.reload();
                    break;
                default:
                    this.gLogin();
                    break;
            }
        }
    }

    public afterGotToken = (afterLogin: () => void) => {
        console.log('requesting user info');
        
        this.userRepository.getUser().subscribe({
            next: (data) => {
                console.log("Logged in as " + data.Name);
                
                this.loggedInUser = data;
                afterLogin();
            }
        })
    }

    private gLogin() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: environment.client_id,
                scope: 'email'
            });

            this.auth2.signIn({ ux_mode: "redirect", redirect_uri: window.location.href, scope: "profile" });
        });
    }
}