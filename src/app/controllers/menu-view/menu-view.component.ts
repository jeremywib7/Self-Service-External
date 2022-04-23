import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../service/product.service";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Environment} from "@angular/cli/lib/config/workspace-schema";

@Component({
    selector: 'app-menu-view',
    templateUrl: './menu-view.component.html',
    styleUrls: ['./menu-view.component.scss']
})
export class MenuViewComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    liked: boolean;

    selectedImageIndex: number = 0;

    quantity: number = 1;

    product: Product;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private productService: ProductService
    ) {
        this.loadProduct();
    }

    loadProduct() {
        let name = this.activatedRoute.snapshot.queryParamMap.get('name');
        let params = new HttpParams();
        params = params.append("name", name);

        this.productService.loadProductDetailByName(params).subscribe({
            next: (value: any) => {
                this.product = value.data;
            }
        });
    }


    ngOnInit(): void {
    }

    addToCart() {

    }


}
