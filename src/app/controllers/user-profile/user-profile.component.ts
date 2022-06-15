import {Component, OnInit} from '@angular/core';
import {CartService} from "../../service/cart.service";
import {environment} from "../../../environments/environment.prod";
import {UserAuthService} from "../../service/user-auth.service";
import {MessageService} from "primeng/api";
import {from} from "rxjs";
import {Router} from "@angular/router";

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
        private router: Router,
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
                    this.router.navigate(["/menu"]);
                }
            });
        } else {
            this.userService.formProfile.markAllAsTouched();
        }
    }

}
