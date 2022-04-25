import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../service/product.service";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Environment} from "@angular/cli/lib/config/workspace-schema";
import {CartService} from "../../service/cart.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserAuthService} from "../../service/user-auth.service";

@Component({
    selector: 'app-menu-view',
    templateUrl: './menu-view.component.html',
    styleUrls: ['./menu-view.component.scss']
})
export class MenuViewComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    isDoneLoadProductInfo: boolean = false;

    isDoneLoadMainImage: boolean = false;

    liked: boolean;

    selectedImageIndex: number = 0;

    cartQuantity: number = 0;

    currentQuantity: number = 1;

    product: Product;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cartService: CartService,
        public auth: AngularFireAuth,
        private userAuthService: UserAuthService,
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

                // wait until cart is initialized
                // then check this product in customer cart
                // if exists then set quantity based on the cart
                (async () => {
                    while (this.cartService.cartInformation['orderedProduct'] === undefined)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    let index = this.cartService.cartInformation['orderedProduct'].findIndex(
                        orderedProduct => orderedProduct.product.id === this.product.id
                    );
                    this.currentQuantity = this.cartService.cartInformation['orderedProduct'][index].quantity;
                })();

            }
        });
    }


    ngOnInit(): void {
    }

    updateCart(productId: string) {
        let params = new HttpParams();
        params = params.append("customerId", this.userAuthService.customerInformation.customer['id']);
        params = params.append("productId", productId);
        params = params.append("productQuantity", this.currentQuantity);

        this.cartService.updateCart(params).subscribe({
            next: (value:any) => {
                this.cartService.cartInformation['orderedProduct'] = value.data.orderedProduct;
            }
        });
    }

}
