import type { TCouponCondition, TUserData } from "@/types/coupon";

const conditionCheckers: { 
    [key in keyof TCouponCondition]: (userData: TUserData, value: number | boolean) => boolean 
} = {
    newUser: (userData: TUserData, value: number | boolean) => {
        if (typeof value === 'boolean') 
            return userData.newUser === value;

        return false; 
    },

    identicalCategories: (userData: TUserData, value: number | boolean) => {
        if (typeof value === 'boolean')
            return false;

        const categoryCount: { [key: string]: number } = {};
        
        for (const item of userData.selectedItems) {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;

            if (categoryCount[item.category] >= value) {
                return true;  
            }
        }
        
        return false;
    },
    
    identicalBrands: (userData: TUserData, value: number | boolean) => {
        if (typeof value === 'boolean')
            return false;

        const brandCount: { [key: string]: number } = {};
        
        for (const item of userData.selectedItems) {
            brandCount[item.brand] = (brandCount[item.brand] || 0) + 1;

            if (brandCount[item.brand] >= value) {
                return true;
            }
        }
    
        return false;
    },

    minPurchase: (userData: TUserData, value: number | boolean) => {
        if (typeof value === 'boolean')
            return false;

        const totalPurchase = userData.selectedItems.reduce(
            (total, item) => total + item.quantity * item.price, 
            0
        );
        return totalPurchase >= value;
    },
};

export function checkCondition(userData: TUserData, couponCondition?: TCouponCondition): boolean {
    if (!couponCondition)
        return true;

    for (const condition in couponCondition) {
        const value = couponCondition[condition as keyof TCouponCondition] as number | boolean;
        const check = conditionCheckers[condition as keyof TCouponCondition];

        if (typeof check === 'function' && !check(userData, value))
            return false;
    }

    return true;
}