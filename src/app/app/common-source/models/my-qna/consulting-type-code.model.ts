export interface ConsultingTypeCode {
    name: string | null;
    code: string | null;
    detail?: string | null;
}

export const TypeCodeList: ConsultingTypeCode[] = [
    { name: '예약문의', code: 'IC01', detail: 'IC01 - 01' },
    { name: '결제문의', code: 'IC01', detail: 'IC01 - 02' },
    { name: '변경문의', code: 'IC01', detail: 'IC01 - 03' },
    { name: '취소문의', code: 'IC01', detail: 'IC01 - 04' },
    { name: '기타', code: 'IC01', detail: 'IC01 - 99' },

    { name: '예약문의', code: 'IC02', detail: 'IC02 - 01' },
    { name: '결제문의', code: 'IC02', detail: 'IC02 - 02' },
    { name: '취소문의', code: 'IC02', detail: 'IC02 - 03' },
    { name: '기타', code: 'IC02', detail: 'IC02 - 99' },

    { name: '예약문의', code: 'IC03', detail: 'IC03 - 01' },
    { name: '결제문의', code: 'IC03', detail: 'IC03 - 02' },
    { name: '취소문의', code: 'IC03', detail: 'IC03 - 03' },
    { name: '기타', code: 'IC03', detail: 'IC03 - 99' },

    { name: '예약문의', code: 'IC04', detail: 'IC04 - 01' },
    { name: '결제문의', code: 'IC04', detail: 'IC04 - 02' },
    { name: '취소문의', code: 'IC04', detail: 'IC04 - 03' },
    { name: '배송문의', code: 'IC04', detail: 'IC04 - 04' },
    { name: '기타', code: 'IC04', detail: 'IC04 - 99' },

];


