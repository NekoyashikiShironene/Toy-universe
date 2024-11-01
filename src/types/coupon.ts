import { RowDataPacket } from "mysql2/promise"
import { TCartItem } from "./products"

export type TUserData = {
    newUser: boolean,
    selectedItems: TCartItem[]
}

export type TCouponCondition = {
    newUser?: boolean,
    identicalCategories?: number,
    identicalBrands?: number,
    minPurchase?: number,
}

export type TPromotion =  RowDataPacket & {
    promo_id: number,
    promo_name: string,
    code: string,
    start_date: string,
    end_date: string,
    discount: number,
    promo_condition: TCouponCondition
}