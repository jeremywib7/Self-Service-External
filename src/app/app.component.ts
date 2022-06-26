import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {MessagingService} from "./service/messaging.service";
import {WaitingList} from "./model/WaitingList";
import {HttpParams} from "@angular/common/http";
import {CustomerProfile} from "./model/CustomerProfile";
import {CustomerCart} from "./model/customerCart/CustomerCart";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserAuthService} from "./service/user-auth.service";
import {OrderService} from "./service/order.service";
import {Router} from "@angular/router";
import {CartService} from "./service/cart.service";
import {firstValueFrom, lastValueFrom} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    menuMode = 'static';
    message: any = null;

    constructor(
        private primengConfig: PrimeNGConfig,
        public auth: AngularFireAuth,
        public userAuthService: UserAuthService,
        public cartService: CartService,
        public orderService: OrderService,
        public angularFireMessaging: AngularFireMessaging,
        private router: Router,
        private messaging: AngularFireMessaging,
        private messagingService: MessagingService
    ) {
        this.auth.authState.subscribe({
            next: async response => {

                // if not null, then user is already logged in
                if (response) {
                    this.userAuthService.customer['id'] = response.uid;
                    this.userAuthService.customer['email'] = response['email'];

                    // get messaging token for fcm
                    await lastValueFrom(this.messaging.requestPermission).then(async value => {

                        await firstValueFrom(this.messaging.requestToken).then(async token => {

                            // update token in database
                            let params = new HttpParams()
                                .append("messagingToken", token)
                                .append("customerId", response.uid);

                            await firstValueFrom(this.userAuthService.updateMessagingToken(params)).then(value => {
                                // console.log(value);
                            }).catch(err => {
                            })
                        });

                    });

                    await this.messagingService.receiveMessage();
                    this.message = this.messagingService.currentMessage;

                    // listen data from firestore waiting list, if response is not undefined, then order is paid and is
                    // in firestore waiting list
                    this.orderService.getWaitingListForCustomer(response.uid).subscribe({
                        next: res => {

                            // if data exists, then waiting list in firestore is placed
                            if (res.payload.data()) {
                                this.orderService.currentOrder = {...res.payload.data() as WaitingList};
                                this.orderService.isInWaitingList = true;
                                this.router.navigate(["/order-success"]).then(null);
                            } else {
                                this.orderService.isInWaitingList = false;
                                this.cartService.cart.isPlacedInOrder = false;
                                this.cartService.cart.cartOrderedProduct = [];
                                // if route is order success then change the dashboard
                                // because order is not available or already finished
                                if (this.router.url === '/order-success') {
                                    this.router.navigate(["/"]).then(null);
                                }
                            }

                            // because view cart in method register
                            // will be called twice without if else
                            if (!this.userAuthService.isRegisterMode) {
                                // get cart items
                                let params = new HttpParams().append("customerId", response.uid);
                                this.cartService.viewCart(params).subscribe({
                                    next: async (value: any) => {
                                        this.cartService.cart = value.data;

                                        // update user profile data
                                        this.userAuthService.formProfile.patchValue(value.data.customerProfile);

                                        // check if fcm token is null
                                        if (this.userAuthService.formProfile.get("messagingToken").value == null) {
                                            const res: any = await firstValueFrom(this.angularFireMessaging.requestToken);
                                            this.userAuthService.formProfile.get("messagingToken").setValue(res);
                                        }

                                        this.cartService.calculateTotalPrice();

                                        this.userAuthService.isLoggedIn = true;
                                        this.userAuthService.buttonAuthText = "Sign Out";

                                    },
                                    error: err => {

                                    }
                                }).add(() => {
                                    // set checking login status to false
                                    this.userAuthService.isDoneLoadConfig = true;
                                });
                            }
                        }
                    });
                } else {
                    // clear global state
                    this.userAuthService.customer = new CustomerProfile();
                    this.cartService.cart = new CustomerCart();

                    // set logged in to false
                    this.userAuthService.isLoggedIn = false;
                    this.userAuthService.buttonAuthText = "Sign In";

                    // set checking login status to false
                    this.userAuthService.isDoneLoadConfig = true;
                }
            }
        });


    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }
}
