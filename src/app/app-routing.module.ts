import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {LandingComponent} from './components/landing/landing.component';
import {ErrorComponent} from './components/error/error.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AccessComponent} from './components/access/access.component';
import {HomeComponent} from "./controllers/home/home.component";
import {MenuBookComponent} from "./controllers/menu-book/menu-book.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: HomeComponent},
                    {path: 'menu', component: MenuBookComponent},
                ],
            },
            {path: 'pages/landing', component: LandingComponent},
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
