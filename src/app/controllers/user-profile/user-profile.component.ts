import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartService} from "../../service/cart.service";
import {environment} from "../../../environments/environment.prod";
import {UserAuthService} from "../../service/user-auth.service";
import {CustomerProfile} from "../../model/CustomerProfile";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        public cartService: CartService,
        public userService: UserAuthService,
        public messageService: MessageService
    ) {
    }

    ngOnInit(): void {
    }

    saveUserProfile() {

        if (this.userService.formProfile.valid) {
            this.userService.saveUserProfile().subscribe({
                next: (value: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: value.message
                    });
                }
            });
        } else {
            this.userService.formProfile.markAllAsTouched();
        }
    }

}
