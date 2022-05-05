import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../service/cart.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        public cartService: CartService,
        private router: Router
    ) {
        // if (!this.cartService.cart.isPlacedInOrder) {
        //     this.router.navigate(["/"]).then(r => null);
        // }
    }

    ngOnInit(): void {

    }

}
