import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../service/order.service";
import {CartService} from "../../../service/cart.service";

@Component({
  selector: 'app-order-detail',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.scss']
})
export class SuccessOrderComponent implements OnInit {

  constructor(
      public orderService: OrderService,
      public cartService: CartService
  ) { }

  ngOnInit(): void {
  }

}
