import {CustomerProfile} from "../CustomerProfile";
import {HistoryProductOrder} from "./HistoryProductOrder";

export abstract class CustomerOrder {
    id: string;
    number: number;
    status: string;
    dateCreated: string;
    updatedOn: string;
    customerProfile: CustomerProfile;
    historyProductOrders: HistoryProductOrder[];
    totalPrice: number;
}
