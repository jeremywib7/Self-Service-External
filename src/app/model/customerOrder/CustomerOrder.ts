import {CustomerProfile} from "../CustomerProfile";
import {HistoryProductOrder} from "./HistoryProductOrder";

export abstract class CustomerOrder {

    id: string;
    number: number;
    orderIsActive: boolean;
    dateTimeCreated: string;
    orderProcessed: string;
    orderFinished: string;
    updatedOn: string;
    customerProfile: CustomerProfile;
    historyProductOrders: HistoryProductOrder[];
    totalPaid: number;
    totalChange: number;
    totalPrice: number;
    estHour: number;
    estMinute: number;
    estSecond: number;
    estTime: string;
}
