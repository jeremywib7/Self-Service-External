import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

    currentMessage = new BehaviorSubject(null);
    constructor(private angularFireMessaging: AngularFireMessaging) {
    }

    requestPermission() {
        this.angularFireMessaging.requestToken.subscribe({
            next: (token) => {
                console.log(token);
            },
            error: (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        });
    }

    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                console.log("new message received. ", payload);
                this.currentMessage.next(payload);
            })
    }}
