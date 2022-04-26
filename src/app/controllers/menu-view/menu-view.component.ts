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

    isDoneLoadProductInfo: boolean = false;

    isDoneLoadMainImage: boolean = false;

    liked: boolean;

    isInCart: boolean = false;

    selectedImageIndex: number = 0;

    currentQuantity: number = 0;

    product: Product;

    subscription: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cartService: CartService,
        private confirmationService: ConfirmationService,
        public auth: AngularFireAuth,
        private userAuthService: UserAuthService,
        private productService: ProductService
    ) {
        this.loadProduct();
    }

    ngOnInit(): void {
    }

    loadProduct() {
        this.isDoneLoadProductInfo = false;
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
                    let index = this.cartService.cart['orderedProduct'].findIndex(
                        orderedProduct => orderedProduct.product.id === this.product.id
                    );
                    // get quantity from global state
                    // if -1 then still there is no quantity in the cart
                    if (index !== -1) {
                        this.isInCart = true;
                        this.currentQuantity = this.cartService.cart['orderedProduct'][index].quantity;
                    } else {
                        this.isInCart = false;
                    }
                    this.isDoneLoadProductInfo = true;
                })();

            }
        });
    }


    onUpdateCart(productId: string) {

        let params = new HttpParams();
        params = params.append("customerId", this.userAuthService.customer['id']);
        params = params.append("productId", productId);
        params = params.append("productQuantity", this.currentQuantity);

        this.cartService.updateCart(params).subscribe({
            next: (value: any) => {
                this.cartService.cart['orderedProduct'] = value.data.orderedProduct;
                this.isInCart = true;
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
                    next: value => {
                        console.log(value);
                        // this.router.navigate(["/menu"]);
                    }
                })
                // this.isCheckingLoginStatus = true;
                // this.auth.signOut().then();
            }
        });
    }

}
