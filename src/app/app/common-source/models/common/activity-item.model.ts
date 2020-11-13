import { Travelers } from '../payment/booker.model';

export interface NeededInfos {
    infoCode: string;
    addValue: string;
    userInputValue: string;
}

export interface ActivityItem {
    itemIndex?: number;
    activityCode: string;
    amountSum: string;
    conditionCodedData: string;
    currencyCode: string;
    deliveryAddress: string;
    deliveryZipCode: string;
    neededInfos: Array<NeededInfos>;
    optionCode: number;
    promotionSeq: string;
    serviceFromDate: string;
    serviceToDate: string;
    travelers: Array<Travelers>;
    productAmount: string;
    discountAmount: string;
}
