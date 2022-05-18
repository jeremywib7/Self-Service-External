import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {getMessaging, getToken, onMessage } from "@angular/fire/messaging";
import {environment} from "../environments/environment.prod";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {MessagingService} from "./service/messaging.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    menuMode = 'static';
    message:any = null;

    constructor(
        private primengConfig: PrimeNGConfig,
        private messaging: AngularFireMessaging,
        private messagingService: MessagingService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.messagingService.requestPermission()
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
    }
}
