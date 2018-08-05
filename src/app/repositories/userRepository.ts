import { Injectable } from "../../../node_modules/@angular/core";
import { Observable } from "../../../node_modules/rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { BaseRepository } from "./baseRepository";
import { HttpClient } from "../../../node_modules/@angular/common/http";

@Injectable()
export class UserRepository extends BaseRepository {
    constructor(private http: HttpClient) {
        super();
    }

    public getUser(): Observable<User> {
        return this.http.get<User>(environment.apiUrl + 'api/users/me', this.getHttpOptions())
    }
}