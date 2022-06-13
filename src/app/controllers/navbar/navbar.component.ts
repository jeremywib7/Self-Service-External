import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {from, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MenuItem, Message} from "primeng/api";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {CartService} from "../../service/cart.service";
import {HttpParams} from "@angular/common/http";
import {CustomerProfile} from "../../model/CustomerProfile";
import {CustomerCart} from "../../model/customerCart/CustomerCart";
import {environment} from "../../../environments/environment";
import {OrderService} from "../../service/order.service";
import {WaitingList} from "../../model/WaitingList";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {MessagingService} from "../../service/messaging.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    config: AppConfig;

    userMenu: MenuItem[];

    loginMsg: Message[];

    registerMsg: Message[];

    resetPasswordMsg: Message[];


    subscription: Subscription;

    totalPrice: number = 0;

    buttonAuthText: string;


    isLoginButtonLoading: boolean = false;

    isRegisterButtonLoading: boolean = false;

    isResetPasswordButtonLoading: boolean = false;

    isPlaceOrderButtonLoading: boolean = false;

    showAuthDialog: boolean = false;

    showResetPasswordDialog: boolean = false;


    @ViewChildren('allTheseThings') things: QueryList<any>;


    loginForm: FormGroup = new FormGroup({
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
        password: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 6})
            ], updateOn: 'blur'
        }),
    });


    registerForm: FormGroup = new FormGroup({
        id: new FormControl(''),
        username: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 3}),
                RxwebValidators.maxLength({value: 20})
            ], updateOn: 'blur'
        }),
        firstName: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        lastName: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        gender: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
        password: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 6})
            ], updateOn: 'blur'
        }),
        messagingToken: new FormControl('', {
            validators: [], updateOn: 'blur'
        }),
    });


    resetPasswordForm: FormGroup = new FormGroup({
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
    });


    constructor(
        public router: Router,
        public configService: ConfigService,
        public userAuthService: UserAuthService,
        public orderService: OrderService,
        public cartService: CartService,
        public angularFireMessaging: AngularFireMessaging,
        public messagingService: MessagingService,
        public auth: AngularFireAuth,
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        // init menu settings and logout
        this.initMenuUser();

    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.things.changes.subscribe({
            next: value => {
                this.ngForRendred();
            }
        })
    }

    ngForRendred() {
        console.log('NgFor is Rendered');
    }

    initMenuUser() {
        this.userMenu = [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'User Profile',
                        routerLink: '/profile',
                        icon: 'pi pi-fw pi-user',
                    },
                    {
                        label: 'History',
                        routerLink: '/history',
                        icon: 'pi pi-fw pi-calendar-times',
                    }
                ]
            },
            // {
            //     separator: true
            // },
            // {
            //     label: 'Logout',
            //     command: () => this.onLogoutClicked(),
            //     icon: 'pi pi-fw pi-power-off'
            // }
        ]
    }

    onUpdateQuantity(event: any) {
        console.log(event.value);
    }

    // reset Forgot password
    onResetPassword() {

        if (this.resetPasswordForm.valid) {
            this.isResetPasswordButtonLoading = true;
            from(this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email)).subscribe({
                next: value => {
                    this.resetPasswordMsg = [
                        {severity: 'success', summary: 'Success', detail: 'Password reset sent to this email'},
                    ];
                },
                error: err => {
                    let errorMessage;
                    switch (err.code) {
                        case 'auth/invalid-email': {
                            errorMessage = 'Email format is invalid';
                            break;
                        }
                        case "auth/user-not-found": {
                            errorMessage = 'User not found for this email'
                            break;
                        }
                        default: {
                            errorMessage = 'Reset password error. Try again later';
                            break;
                        }
                    }

                    this.resetPasswordMsg = [
                        {severity: 'error', summary: 'Failed', detail: errorMessage},
                    ];
                }
            }).add(() => {
                //Called when operation is complete (both success and error)
                this.isResetPasswordButtonLoading = false;
            });
        } else {
            this.resetPasswordForm.markAllAsTouched();
        }

    }

    openLoginOrLogoutDialog() {
        // if not logged in
        if (!this.userAuthService.isLoggedIn) {
            return this.showAuthDialog = true;
        }

        // if already logged in
        return this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                this.userAuthService.isDoneLoadConfig = true;
                this.auth.signOut().then(() => {
                });
            }
        });
    }

    onLogin() {

        if (this.loginForm.valid) {
            this.isLoginButtonLoading = true;

            const {email, password} = this.loginForm.value;

            this.auth.signInWithEmailAndPassword(email, password).then(user => {

                this.loginMsg = [];
                this.showAuthDialog = false;
            }).catch(
                err => {
                    let errorMessage = "";
                    switch (err.code) {
                        case 'auth/user-disabled': {
                            errorMessage = 'Sorry your user is disabled.';
                            break;
                        }
                        case 'auth/user-not-found': {
                            errorMessage = 'Sorry user not found.';
                            break;
                        }

                        case 'auth/wrong-password': {
                            errorMessage = 'Sorry, incorrect password entered. Please try again.';
                            break;
                        }

                        default: {
                            errorMessage = 'Login error try again later.';
                            break;
                        }
                    }

                    return this.loginMsg = [{
                        severity: 'error', detail: errorMessage
                    }]
                }
            ).finally(() => this.isLoginButtonLoading = false);

        } else {
            this.loginForm.markAllAsTouched();
        }

    }

    onRegister() {

        if (this.registerForm.valid) {
            this.isRegisterButtonLoading = true;

            this.angularFireMessaging.requestToken.subscribe({
                next: (token) => {

                    this.registerForm.get("messagingToken").setValue(token);

                    // register in backend
                    this.userAuthService.registerCustomer(this.registerForm.value).subscribe({
                        next: (value: any) => {
                            this.registerMsg = [];
                            this.showAuthDialog = false;

                            // get cart information
                            this.cartService.cart = value.data;
                            this.userAuthService.isLoggedIn = true;

                            // sign in using firebase
                            this.auth.signInWithEmailAndPassword(this.registerForm.get('email').value,
                                this.registerForm.get('password').value).then(user => {
                                this.loginMsg = [];
                                this.showAuthDialog = false;
                            })
                        },
                        error: err => {
                            return this.registerMsg = [{
                                severity: 'error', detail: err.error.message
                            }]
                        }

                    }).add(() => {
                        this.isRegisterButtonLoading = false;
                    });

                },
                error: (err) => {
                    console.error('Unable to get permission to notify.', err);
                }
            });

        } else {
            this.registerForm.markAllAsTouched();
        }

    }

    onPlaceOrder() {
        this.isPlaceOrderButtonLoading = true;
        let params = new HttpParams().append("customerId", this.cartService.cart.customerProfile.id)

        this.orderService.addOrder(params, this.cartService.cart.cartOrderedProduct).subscribe({
            next: () => {
                this.isPlaceOrderButtonLoading = false;

                // update status set as placed order true
                this.cartService.cart.isPlacedInOrder = true;

                // close side cart
                document.getElementById("closeSideCart").click();

                this.router.navigate(["/order-pending"]).then(null);
            }
        })

    }

    onChangeQuantityFromCart(quantity: number, productId: string, index: number) {
        if (quantity > 0) {
            let params = new HttpParams();
            params = params.append("customerId", this.userAuthService.customer['id']);
            params = params.append("productId", productId);
            params = params.append("productQuantity", quantity);

            this.cartService.updateInCart(params).subscribe({
                next: () => {
                    this.cartService.cart.cartOrderedProduct[index].quantity = quantity;

                    this.cartService.totalPrice = 0; // reset to 0

                    // calculate total price of cart
                    this.cartService.calculateTotalPrice();
                }
            });

        }
    }

    onDeleteFromCart(productName: string, productId: string, index) {
        this.confirmationService.confirm({
            message: 'Are you sure you want remove ' + `<b>${productName}</b>` + ' from your cart ?',
            header: 'Remove Product',
            accept: () => {
                // set skeleton in menu view active
                this.cartService.isDoneLoadProductInfo = false;

                // create http params
                let params = new HttpParams()
                    .append("customerId", this.userAuthService.customer['id'])
                    .append("productId", productId);

                this.cartService.removeProductFromCart(params).subscribe({
                    next: () => {
                        this.cartService.cart.cartOrderedProduct.splice(index, 1);

                        // check if last viewed product still in the cart,
                        // so it updates the button in menu view between add product or update product
                        let index1 = this.cartService.cart.cartOrderedProduct.findIndex(
                            orderedProduct => orderedProduct.product.id === this.cartService.lastViewedProductId
                        );

                        // if != -1 then last viewed product still in the cart
                        this.cartService.isInCart = index1 != -1;

                        // set skeleton in menu view done
                        this.cartService.isDoneLoadProductInfo = true;

                        // calculate total price of cart
                        this.cartService.calculateTotalPrice();

                    }
                })
            }
        });
    }

    onHideDialog() {
        if (this.userAuthService.isRegisterMode) {

        } else {
            this.loginForm.reset();
            this.loginMsg = [];
        }
    }

    onChangeAuthMode() {
        this.userAuthService.isRegisterMode = !this.userAuthService.isRegisterMode;
        this.resetForm();

        // for testing
        this.registerForm.patchValue({
            username: 'TheWorldWar3',
            firstName: 'Jeremy',
            lastName: 'Yonathan',
            gender: 'Male',
            email: 'jeremywib7@gmail.com',
            password: '123456'

        })
    }

    resetForm() {
        this.loginForm.reset();
        this.loginMsg = [];
        this.registerForm.reset();
        this.registerMsg = [];
    }

    onHideResetPasswordDialog() {
        this.resetPasswordForm.reset();
        this.resetPasswordMsg = [];
    }

}
