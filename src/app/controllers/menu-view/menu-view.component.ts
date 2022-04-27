import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../service/product.service";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CartService} from "../../service/cart.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserAuthService} from "../../service/user-auth.service";
import {Subscription} from "rxjs";
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'app-menu-view',
    templateUrl: './menu-view.component.html',
    styleUrls: ['./menu-view.component.scss']
})
export class MenuViewComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    isDoneLoadMainImage: boolean = false;

    liked: boolean;

    selectedImageIndex: number = 0;

    currentQuantity: number = 0;

    index: number = -1;

    product: Product;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public cartService: CartService,
        private confirmationService: ConfirmationService,
        public auth: AngularFireAuth,
        public userAuthService: UserAuthService,
        private productService: ProductService
    ) {
        this.loadProduct();
    }

    ngOnInit(): void {
    }

    loadProduct() {
        this.cartService.isDoneLoadProductInfo = false; // set skeleton

        // create params
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
                    while (this.cartService.cart['orderedProduct'] === undefined)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    this.index = this.cartService.cart['orderedProduct'].findIndex(
                        orderedProduct => orderedProduct.product.id === this.product.id
                    );

                    // get quantity from global state
                    // if -1 then still there is no quantity in the cart
                    if (this.index !== -1) {
                        this.cartService.isInCart = true;
                        this.currentQuantity = this.cartService.cart['orderedProduct'][this.index].quantity;
                    } else {
                        this.cartService.isInCart = false;
                    }

                    // set last viewed product id
                    // to check if still exist after a deletion process from cart
                    this.cartService.lastViewedProductId = this.product.id;

                    // set skeleton loading done
                    this.cartService.isDoneLoadProductInfo = true;
                })();

            }
        });
    }

    onDeleteFromCart() {
        this.confirmationService.confirm({
            message: 'Are you sure you want remove ' + `<b>${this.product.name}</b>` + ' from your cart ?',
            header: 'Remove Product',
            accept: () => {
                let params = new HttpParams()
                    .append("customerId", this.userAuthService.customer['id'])
                    .append("productId", this.product.id);
                this.cartService.removeProductFromCart(params).subscribe({
                    next: (value: any) => {
                        this.currentQuantity = 0;
                        this.cartService.cart.orderedProduct.splice(this.index,1)
                        this.router.navigate(["/menu"]).then(r => null);
                    }
                })
            }
        });
    }

}
