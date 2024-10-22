export type Product = {
    prod_id: number;       
    prod_name: string;     
    category_id: number;   
    brand: string;         
    description: string;    
    price: number;         
    quantity: number;      
}

export type TCartItem = Product & {
    checked?: boolean
}