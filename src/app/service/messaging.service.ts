import {Injectable} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Observable} from "rxjs";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    currentMessage = new BehaviorSubject(null);

    constructor(
        private angularFireMessaging: AngularFireMessaging
    ) {
    }

    requestPermission(): string {
        this.angularFireMessaging.requestPermission.subscribe({
            next: value => {
                console.log(value);

                this.angularFireMessaging.requestToken.subscribe({
                    next: (token) => {
                        return token;
                    },
                    error: (err) => {
                        console.error('Unable to get permission to notify.', err);
                    }
                });
            }
        })

        return null;
    }


    receiveMessage() : Promise<Observable<string>>{

        return this.angularFireMessaging.onMessage((payload: any) => {
            console.log("new message received. ", payload);
            this.currentMessage.next(payload);
        }).then(r => null);

    }

}
