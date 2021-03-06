import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {ErrorComponent} from './components/error/error.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AccessComponent} from './components/access/access.component';
import {HomeComponent} from "./controllers/home/home.component";
import {MenuBookComponent} from "./controllers/menu-book/menu-book.component";
import {CartComponent} from "./controllers/cart/cart.component";
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/compat/auth-guard";
import {HistoryComponent} from "./controllers/history/history.component";
import {MenuViewComponent} from "./controllers/menu-view/menu-view.component";
import {SuccessOrderComponent} from "./controllers/order/success-order/success-order.component";
import {PendingOrderComponent} from "./controllers/order/pending-order/pending-order.component";
import {UserProfileComponent} from "./controllers/user-profile/user-profile.component";

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['']);

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: HomeComponent},
                    {path: 'menu', component: MenuBookComponent},
                    {
                        path: 'profile',
                        component: UserProfileComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                    {
                        path: 'cart',
                        component: CartComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                    {
                        path: 'history',
                        component: HistoryComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                    {
                        path: 'view',
                        component: MenuViewComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                    {
                        path: 'order-pending',
                        component: PendingOrderComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                    {
                        path: 'order-success',
                        component: SuccessOrderComponent,
                        canActivate: [AngularFireAuthGuard],
                        data: {authGuardPipe: redirectUnauthorizedToHome}
                    },
                ],
            },
            {path: 'pages/error', component: ErrorComponent},
            {path: 'pages/notfound', component: NotfoundComponent},
            {path: 'pages/access', component: AccessComponent},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
