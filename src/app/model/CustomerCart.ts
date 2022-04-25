import {CustomerProfile} from "./CustomerProfile";
import {OrderedProduct} from "./OrderedProduct";

export class CustomerCart {
    id: string;
    dateCreated: string;
    updatedOn: string;
    customerProfile: CustomerProfile;
    orderedProduct: OrderedProduct[];
}

