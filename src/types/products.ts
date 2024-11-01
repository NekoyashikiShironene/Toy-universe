export type Product = {
    prod_id: number,       
    prod_name: string,     
    category: string,   
    brand: string,         
    description: string,    
    price: number,      
    remaining: number,   
}

export type TCartItem = Product & {
    checked?: boolean,
    quantity: number,
    availability?: boolean
}