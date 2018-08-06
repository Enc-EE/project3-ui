import { Injectable } from "../../../node_modules/@angular/core";
import { BaseRepository } from "./baseRepository";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";
import { ListItem } from "../models/listItem";
import { environment } from "../../environments/environment";

@Injectable()
export class ListItemRepository extends BaseRepository {
    constructor(private http: HttpClient) { super(); }

    public getAll(listId: number): Observable<Array<ListItem>> {
        return this.http.get<Array<ListItem>>(environment.apiUrl + 'api/lists/' + listId + '/list-items', this.getHttpOptions());
    }

    public create(listId: number, listItem: ListItem): Observable<number> {
        return this.http.post<number>(environment.apiUrl + 'api/lists/' + listId + '/list-items', listItem, this.getHttpOptions());
    }
}