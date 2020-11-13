export interface Insurance {
    code: string;
    name: string;
}

export const InsuranceList: Insurance[] = [
    { code: 'NoInsurance', name: '보험 미포함' },
    { code: 'GeneralCar', name: '일반자차포함' },
    { code: 'LuxuryCar', name: '고급자차포함' },
    { code: 'PremiumCar', name: '프리미엄자차포함' },
]
