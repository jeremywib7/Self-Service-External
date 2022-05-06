import {CustomerProfile} from "../CustomerProfile";
import {CartOrderedProduct} from "./CartOrderedProduct";

export class CustomerCart {
    id: string;
    dateCreated: string;
    updatedOn: string;
    customerProfile: CustomerProfile;
    isPlacedInOrder: boolean;
    cartOrderedProduct: CartOrderedProduct[];
}

