import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/Product";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'app-menu-book',
    templateUrl: './menu-book.component.html',
    styleUrls: ['./menu-book.component.scss']
})
export class MenuBookComponent implements OnInit {

    products: Product[] = [];

    sortField: string;

    sortOrder: number;

    sortOptions: SelectItem[];

    constructor() {
    }

    ngOnInit(): void {
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

}
