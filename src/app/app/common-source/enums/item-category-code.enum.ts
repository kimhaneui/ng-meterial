/**
 *
 * 각 메뉴(항공,호텔,렌터카,티켓/투어,일정표,액티비티등)별 요청코드
 * IC01,   // 항공
 * IC02,   // 호텔
 * IC03,   // 렌터카
 * IC04,   // 티켓/투어, 액티비티
 * IC05,   // 일정표
 * IC98,   // 시스템문의
 * IC99,   // 일반문의
 * ICE     // INTER-CITY EXPRESS
 *
 * 20200213 현재 IC01 ~ IC05 까지만 사용함.
 * IC05는 내부적으로 어떤 값으로 사용되는지 확인이 필요.
 */
export enum ItemCategoryCode {
    FLIGHT = 'IC01',
    HOTELS = 'IC02',
    RENT = 'IC03',
    ACTIVITY = 'IC04',
    SCHEDULE = 'IC05'
}

export function getItemCategoryCode(type: string): string {
    let returnText = ItemCategoryCode.FLIGHT;
    switch (type) {
        case 'flight':
            returnText = ItemCategoryCode.FLIGHT;
            break;

        case 'hotels':
            returnText = ItemCategoryCode.HOTELS;
            break;

        case 'rent':
            returnText = ItemCategoryCode.RENT;
            break;

        case 'activity':
            returnText = ItemCategoryCode.ACTIVITY;
            break;

        case 'schedule':
            returnText = ItemCategoryCode.SCHEDULE;
            break;
    }

    return returnText;
}