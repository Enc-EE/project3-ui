import { Injectable } from "../../../node_modules/@angular/core";
import { Observable } from "../../../node_modules/rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { BaseRepository } from "./baseRepository";
import { HttpClient, HttpHeaders } from "../../../node_modules/@angular/common/http";
import { ConfigService } from "../services/configService";

@Injectable()
export class UserRepository extends BaseRepository {
    constructor(private http: HttpClient) {
        super();
    }

    public wakeUp(): Observable<User> {
        return this.http.get<User>(environment.apiUrl + 'api/users/me', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test'
            })
        })
    }

    public getUser(): Observable<User> {
        return this.http.get<User>(environment.apiUrl + 'api/users/me', this.getHttpOptions())
    }

    public getAll(): Observable<Array<User>> {
        return this.http.get<Array<User>>(environment.apiUrl + 'api/users', this.getHttpOptions())
    }
}