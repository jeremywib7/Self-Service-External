import {Component, OnInit} from '@angular/core';
import {CartService} from "../../service/cart.service";
import {environment} from "../../../environments/environment.prod";
import {UserAuthService} from "../../service/user-auth.service";
import {MessageService} from "primeng/api";
import {from} from "rxjs";

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

    // resetPassword(email: string) {
    //     from(this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email)).subscribe({
    //         next: () => {
    //             this.resetPasswordMsg = [
    //                 {severity: 'success', summary: 'Success', detail: 'Password reset sent to this email'},
    //             ];
    //         },
    //         error: err => {
    //             let errorMessage = this.userAuthService.catchSendPasswordResetEmail(err);
    //             this.resetPasswordMsg = [
    //                 {severity: 'error', summary: 'Failed', detail: errorMessage},
    //             ];
    //         }
    //     }).add(() => {
    //         //Called when operation is complete (both success and error)
    //         this.isResetPasswordButtonLoading = false;
    //     });
    // }

}
