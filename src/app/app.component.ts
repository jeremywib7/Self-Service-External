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
import {NgxSpinnerService} from "ngx-spinner";

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
        private spinner: NgxSpinnerService,
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
                if (response != null) {
                    this.userAuthService.customer['id'] = response.uid;
                    this.userAuthService.customer['email'] = response['email'];
                    this.userAuthService.isLoggedIn = true;
                    this.userAuthService.buttonAuthText = "Sign Out";

                    // get messaging token for fcm
                    await lastValueFrom(this.messaging.requestPermission);
                    const token : any = await firstValueFrom(this.messaging.requestToken);

                    // update token in database
                    let params2 = new HttpParams()
                        .append("messagingToken", token)
                        .append("customerId", response.uid);

                    await firstValueFrom(this.userAuthService.updateMessagingToken(params2));

                    // get cart items
                    let params1 = new HttpParams().append(  "customerId", response.uid);
                    const value: any = await firstValueFrom(this.cartService.viewCart(params1));
                    this.cartService.cart = value.data;
                    this.cartService.calculateTotalPrice();
                    this.userAuthService.formProfile.patchValue(value.data.customerProfile); // update user profile data

                    // detect for push notification
                    await this.messagingService.receiveMessage();
                    this.message = this.messagingService.currentMessage;

                    this.orderService.getWaitingListForCustomer(response.uid).subscribe({
                        next: async res => {
                            if (res.payload.data()) {
                                if (res.payload.data()["status"] == "COMPLETED") {
                                    this.orderService.isInWaitingList = false;
                                    this.cartService.cart.cartOrderedProduct = [];

                                    // delete waiting list in firestore
                                    await firstValueFrom(orderService.deleteWaitingListFirebase(new HttpParams().append(
                                        'customerId',response.uid)));

                                    if (this.router.url === '/order-success') {
                                        return this.router.navigate(["/"]).then(null);
                                    }
                                    return null;
                                }

                                this.orderService.currentOrder = {...res.payload.data() as WaitingList};
                                this.orderService.isInWaitingList = true;
                                return this.router.navigate(["/order-success"]).then(null);
                            }

                            this.orderService.isInWaitingList = false;
                        },
                    });

                    // listen data from firestore waiting list, if response is not undefined, then order is paid and is
                    // in firestore waiting list
                    this.userAuthService.isDoneLoadConfig = true;
                    await this.spinner.hide("start");

                } else {
                    // clear global state
                    this.userAuthService.customer = new CustomerProfile();
                    this.cartService.cart = new CustomerCart();

                    // set logged in to false
                    this.userAuthService.isLoggedIn = false;
                    this.userAuthService.buttonAuthText = "Sign In";

                    // set checking login status to false
                    this.userAuthService.isDoneLoadConfig = true;
                    await this.spinner.hide("start");
                }
            }
        });

    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }
}
