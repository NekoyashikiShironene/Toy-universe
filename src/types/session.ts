export type CartItem = {
    id: number,
    quantity: number
};

export type UserSession = {
    name: string,
    email: string,
    image: string,
    id: string,
    role: string,
    cart: CartItem[],
    provider: string
}