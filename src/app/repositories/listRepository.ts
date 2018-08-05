import { Injectable } from "../../../node_modules/@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "../../../node_modules/rxjs";
import { List } from "../models/list";
import { BaseRepository } from "./baseRepository";
import { HttpClient } from "../../../node_modules/@angular/common/http";

@Injectable()
export class ListRepository extends BaseRepository {
    constructor(private http: HttpClient) {
        super();
    }

    public getLists(): Observable<Array<List>> {
        return this.http.get<Array<List>>(environment.apiUrl + 'api/lists', this.getHttpOptions());
    }
}