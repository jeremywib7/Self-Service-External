export class WaitingList {
    id: string;
    number: number;
    customerName: string;
    status: string;
    estTime: number;

    constructor(number: number, customerName: string) {
        this.number = number;
        this.customerName = customerName;
    }
}
