export type Pagination = {
    page?: number,
}

export type ProductParams = Pagination & {
    category?: string[],
    brand?: string[],
    query?: string
    maxPrice?: number
}

