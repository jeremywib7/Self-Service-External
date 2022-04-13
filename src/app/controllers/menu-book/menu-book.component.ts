import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../model/Product";
import {LazyLoadEvent, MessageService, SelectItem} from "primeng/api";
import {ProductService} from "../../service/product.service";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {InputNumber} from "primeng/inputnumber";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
    selector: 'app-menu-book',
    templateUrl: './menu-book.component.html',
    styleUrls: ['./menu-book.component.scss']
})
export class MenuBookComponent implements OnInit {
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    isLoadingProducts: boolean = false;

    products: Product[] = [];

    sortField: string;

    sortOrder: number;

    sortOptions: SelectItem[];

    @ViewChild('inputQuantity') inputQuantity;

    constructor(private productService: ProductService, private messageService: MessageService) {
    }

    ngOnInit(): void {
    }

    loadAllProducts(event: LazyLoadEvent) {

        let params = new HttpParams();
        params = params.append("page", event.first / event.rows);

        if (event.globalFilter) {
            params = params.append("searchKeyword", event.globalFilter);
        }

        if (event.sortField) {
            params = params.append("sortedFieldName", event.sortField);
        }

        params = params.append("order", 0);
        params = params.append("size", event.rows);

        this.productService.loadAllProducts(params).subscribe({
            next: (value: any) => {
                this.products = value['data']['content'];
            }
        });

    }

    onAddToCart(overlayPanel: OverlayPanel, $event) {
        overlayPanel.hide();
        overlayPanel.toggle($event);

        setTimeout(() => {                           // <<<---using ()=> syntax
            this.inputQuantity.input.nativeElement.focus();
        }, 200);
    }

    onConfirmQuantityToCart(inputNumber: InputNumber, overlayPanel: OverlayPanel) {
        // TODO check if minimum 1 pcs
        if (inputNumber.value >= 1) {

            // TODO http post
            // on success
            overlayPanel.hide();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Added to cart !',
                life: 3000
            });

        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: 'Add minimum 1 product !',
                life: 3000
            });
        }
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
