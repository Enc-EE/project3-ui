import { Injectable } from "../../../node_modules/@angular/core";
import { HttpClient, HttpHeaders } from "../../../node_modules/@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "../../../node_modules/rxjs";
import { List } from "../models/list";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class ListRepository {

    constructor(private http: HttpClient) { }

    public getLists(): Observable<Array<List>> {
        return this.http.get<Array<List>>(environment.apiUrl + 'api/lists', httpOptions)
    }
}