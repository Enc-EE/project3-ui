import { ListItem } from "./listItem";

export class ListItemGroup {
    public Id: number;
    public Name: string;
    public ListItems: Array<ListItem> = [];
}