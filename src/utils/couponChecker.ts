import type { TCouponCondition, TUserData } from "@/types/coupon";

const conditionCheckers: { [key in keyof TCouponCondition]: (userData: TUserData, value: any) => boolean } = {
    newUser: (userData: TUserData, value: boolean) => userData.newUser,

    identicalCategories: (userData: TUserData, value: number) => {
        const temp: { [key in keyof any]: number } = {};
        
        for (const item of userData.selectedItems) {
            if (!temp[item.category]) {
                temp[item.category] = 1;
            } else {
                temp[item.category]++;
            }
    
            if (temp[item.category] >= value) {
                return true;  
            }
        }
        
        return false;
    },
    
    identicalBrands: (userData: TUserData, value: number) => {
        const temp: { [key in keyof any]: number } = {};
        
        for (const item of userData.selectedItems) {
            if (!temp[item.brand]) {
                temp[item.brand] = 1;
            } else {
                temp[item.brand]++;
            }
    
            if (temp[item.brand] >= value) {
                return true;
            }
        }
    
        return false;
    },
    

    minPurchase: (userData: TUserData, value: number) => {
        const purchase = userData.selectedItems.reduce(
            (prev, current) => prev + current.quantity * current.price
        , 0)
        return purchase >= value;
    },
};



export function checkCondition(userData: TUserData, couponCondition: TCouponCondition): boolean {
    if (!couponCondition)
        return true;

    for (let condition in couponCondition) {
        const value = couponCondition[condition as keyof TCouponCondition];
        const check = conditionCheckers[condition as keyof TCouponCondition];

        if (typeof check === 'function' && !check(userData, value))
            return false;
    }

    return true;

}