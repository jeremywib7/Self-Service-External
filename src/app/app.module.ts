import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy, DatePipe, AsyncPipe} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {StyleClassModule} from 'primeng/styleclass';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeSelectModule} from 'primeng/treeselect';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {BlockViewer} from './components/blockviewer/blockviewer.component';

import {AppCodeModule} from './components/app-code/app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {AppConfigComponent} from './app.config.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';

import {DashboardComponent} from './components/dashboard/dashboard.component';
import {FormLayoutComponent} from './components/formlayout/formlayout.component';
import {FloatLabelComponent} from './components/floatlabel/floatlabel.component';
import {InvalidStateComponent} from './components/invalidstate/invalidstate.component';
import {InputComponent} from './components/input/input.component';
import {ButtonComponent} from './components/button/button.component';
import {TableComponent} from './components/table/table.component';
import {ListComponent} from './components/list/list.component';
import {TreeComponent} from './components/tree/tree.component';
import {PanelsComponent} from './components/panels/panels.component';
import {OverlaysComponent} from './components/overlays/overlays.component';
import {MediaComponent} from './components/media/media.component';
import {MenusComponent} from './components/menus/menus.component';
import {MessagesComponent} from './components/messages/messages.component';
import {MiscComponent} from './components/misc/misc.component';
import {EmptyComponent} from './components/empty/empty.component';
import {ChartsComponent} from './components/charts/charts.component';
import {FileComponent} from './components/file/file.component';
import {DocumentationComponent} from './components/documentation/documentation.component';
import {CrudComponent} from './components/crud/crud.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {IconsComponent} from './components/icons/icons.component';
import {BlocksComponent} from './components/blocks/blocks.component';
import {PaymentComponent} from './components/menus/payment.component';
import {ConfirmationComponent} from './components/menus/confirmation.component';
import {PersonalComponent} from './components/menus/personal.component';
import {SeatComponent} from './components/menus/seat.component';
import {LandingComponent} from './components/landing/landing.component';

import {CountryService} from './service/countryservice';
import {CustomerService} from './service/customerservice';
import {EventService} from './service/eventservice';
import {IconService} from './service/iconservice';
import {NodeService} from './service/nodeservice';
import {PhotoService} from './service/photoservice';
import {ProductService} from './service/productservice';
import {MenuService} from './service/app.menu.service';
import {ConfigService} from './service/app.config.service';
import {LoginComponent} from './components/login/login.component';
import {ErrorComponent} from './components/error/error.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AccessComponent} from './components/access/access.component';
import {HomeComponent} from './controllers/home/home.component';
import {NavbarComponent} from './controllers/navbar/navbar.component';
import {MenuBookComponent} from './controllers/menu-book/menu-book.component';
import {ConfirmationService, MessageService} from "primeng/api";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {LOADING_BAR_CONFIG} from "@ngx-loading-bar/core";
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
import {environment} from "../environments/environment.prod";
import {AngularFireModule} from "@angular/fire/compat";
import {UserAuthService} from "./service/user-auth.service";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {CartComponent} from './controllers/cart/cart.component';
import {BlockUIModule} from "primeng/blockui";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {HistoryComponent} from './controllers/history/history.component';
import {UserProfileComponent} from './controllers/user-profile/user-profile.component';
import {MenuViewComponent} from './controllers/menu-view/menu-view.component';
import {ImageLoaderComponent} from './components/image-loader/image-loader.component';
import {SuccessOrderComponent} from './controllers/order/success-order/success-order.component';
import {OrderService} from "./service/order.service";
import {PendingOrderComponent} from './controllers/order/pending-order/pending-order.component';
import {QRCodeModule} from "angularx-qrcode";

import {registerLocaleData} from '@angular/common';
import localeId from '@angular/common/locales/id';
import {CountdownModule} from "ngx-countdown";
import {initializeApp} from "@angular/fire/app";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import {MessagingService} from "./service/messaging.service";

registerLocaleData(localeId, 'id');

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        ChipModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TagModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeSelectModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        StyleClassModule,

        //my
        // for HttpClient use:
        LoadingBarHttpClientModule,
        LazyLoadImageModule,
        ReactiveFormsModule,

        // firebase
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireMessagingModule,
        BlockUIModule,
        ProgressSpinnerModule,
        QRCodeModule,
        CountdownModule,

    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        DashboardComponent,
        FormLayoutComponent,
        FloatLabelComponent,
        InvalidStateComponent,
        InputComponent,
        ButtonComponent,
        TableComponent,
        ListComponent,
        LoginComponent,
        TreeComponent,
        PanelsComponent,
        OverlaysComponent,
        MenusComponent,
        MenuViewComponent,
        MessagesComponent,
        MessagesComponent,
        MiscComponent,
        ChartsComponent,
        EmptyComponent,
        FileComponent,
        IconsComponent,
        DocumentationComponent,
        CrudComponent,
        TimelineComponent,
        BlocksComponent,
        BlockViewer,
        MediaComponent,
        PaymentComponent,
        ConfirmationComponent,
        PersonalComponent,
        SeatComponent,
        LandingComponent,
        LoginComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,
        HomeComponent,
        NavbarComponent,
        MenuBookComponent,
        MenuBookComponent,
        CartComponent,
        HistoryComponent,
        UserProfileComponent,
        MenuViewComponent,
        ImageLoaderComponent,
        SuccessOrderComponent,
        PendingOrderComponent,
    ],
    providers: [
        {
            provide: LocationStrategy, useClass: HashLocationStrategy
        },
        {
            provide: LOCALE_ID, useValue: "id-ID"
        },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        AsyncPipe,
        PhotoService,
        MenuService,
        ConfigService,

        // my
        {
            provide: LAZYLOAD_IMAGE_HOOKS,
            useClass: AppModule
        },
        {
            provide: LOADING_BAR_CONFIG,
            useValue: {latencyThreshold: 0}
        },

        DatePipe,
        ConfirmationService,
        MessageService,
        MessagingService,
        AsyncPipe,
        UserAuthService,
        OrderService,
        ProductService,
        RxFormBuilder,
        RxwebValidators
    ],
    bootstrap: [AppComponent]
})

export class AppModule extends IntersectionObserverHooks {
}
