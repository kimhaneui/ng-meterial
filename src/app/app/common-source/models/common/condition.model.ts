import { environment } from '@/environments/environment';

import { Booker, Travelers } from '../payment/booker.model';
import { ActivityItem } from './activity-item.model';

export interface EasyPay {
    amount: number;
    // base64로 변환
    encodeData: string;
}

export interface InicisPaymentSecondPayment {
    coupons: Array<any>;
    point: number;
    cards: Array<any>;
    easyPay: EasyPay;
}

export interface Condition {
    activityItems?: ActivityItem;
    flightItems?: any;
    hotelItems?: any;
    rentItems?: any;
    compCode?: number;
    itemCategoryCode?: string;
    keyword?: string;
    limits?: Array<number>;
    userNo?: Number;
    bookingItemCode?: string;
    // 선결제로 예약을 진행했을경우에는 반드시 입력해줘야한다.
    bookingCode?: string;
    // 제휴사 예약번호를 먼저 생성하는 경우 사용
    affiliateBookingCode?: string;
    // 뭘까?
    itineraryMasterSeq?: number;
    // 이건 또 뭐지?
    domainAddress?: string;
    // 접속 기기 타입
    deviceTypeCode?: string;
    // 예약자
    booker?: Booker;
    travelers?: Array<Travelers>;
    payment?: InicisPaymentSecondPayment;
    agreeTerms?: number[];
    tripTypeCode?: string;
    adultCount?: number;
    childCount?: number;
    infantCount?: number;
    cabinClassCode?: string;
    itineraries?: Array<any>;
    dynamicSearchYn?: boolean;
    filter?: any;
    cityCode?: string;
    activityCode?: string;
    activityCategoryCode?: string;
    activityMasterSeq?: number;
}

export interface RequestParam {
    stationTypeCode?: string;
    currency?: string;
    language: string;
    condition?: Condition;
    transactionSetId?: string;
    selectCode?: string;
}

export const RequestSet: RequestParam = {
    stationTypeCode: environment.STATION_CODE,
    currency: 'KRW',
    language: 'KO',
    condition: {}
};
