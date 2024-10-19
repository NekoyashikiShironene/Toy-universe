export type CartItem = number;

export type UserSession = {
    name: string,
    email: string,
    image: string,
    id: string,
    role: string,
    cart: CartItem[]
}