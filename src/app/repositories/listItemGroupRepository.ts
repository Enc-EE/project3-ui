import { Injectable } from "../../../node_modules/@angular/core";
import { BaseRepository } from "./baseRepository";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";
import { ListItem } from "../models/listItem";
import { environment } from "../../environments/environment";
import { ListItemGroup } from "../models/listItemGroup";

@Injectable()
export class ListItemGroupRepository extends BaseRepository {
    constructor(private http: HttpClient) { super(); }

    public getAll(listId: number): Observable<Array<ListItemGroup>> {
        return this.http.get<Array<ListItemGroup>>(environment.apiUrl + 'api/lists/' + listId + '/list-item-groups', this.getHttpOptions());
    }

    public create(listId: number, listItemGroup: ListItemGroup): Observable<number> {
        return this.http.post<number>(environment.apiUrl + 'api/lists/' + listId + '/list-item-groups', listItemGroup, this.getHttpOptions());
    }

    public update(listId: number, listItemGroupId, listItemGroup: ListItemGroup): Observable<{}> {
        return this.http.put(environment.apiUrl + 'api/lists/' + listId + '/list-item-groups/' + listItemGroupId, listItemGroup, this.getHttpOptions());
    }

    public delete(listId: number, listItemGroupId: number): Observable<{}> {
        return this.http.delete(environment.apiUrl + 'api/lists/' + listId + '/list-item-groups/' + listItemGroupId, this.getHttpOptions());
    }
}