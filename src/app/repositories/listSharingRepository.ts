import { Injectable } from "../../../node_modules/@angular/core";
import { BaseRepository } from "./baseRepository";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";
import { ListItem } from "../models/listItem";
import { environment } from "../../environments/environment";
import { ListSharing } from "../models/listSharing";

@Injectable()
export class ListSharingRepository extends BaseRepository {
    constructor(private http: HttpClient) { super(); }

    public getAll(listId: number): Observable<Array<ListSharing>> {
        return this.http.get<Array<ListSharing>>(environment.apiUrl + 'api/lists/' + listId + '/list-sharings', this.getHttpOptions());
    }

    public create(listId: number, listSharing: ListSharing): Observable<number> {
        return this.http.post<number>(environment.apiUrl + 'api/lists/' + listId + '/list-sharings', listSharing, this.getHttpOptions());
    }

    // public update(listId: number, listItemId, listItem: ListItem): Observable<{}> {
    //     return this.http.put(environment.apiUrl + 'api/lists/' + listId + '/list-sharings/' + listItemId, listItem, this.getHttpOptions());
    // }

    public delete(listId: number, listSharingId: number): Observable<{}> {
        return this.http.delete(environment.apiUrl + 'api/lists/' + listId + '/list-sharings/' + listSharingId, this.getHttpOptions());
    }
}