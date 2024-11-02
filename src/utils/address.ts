import { type Address } from "@/types/address";

export function formatAddress(address: Address): string {
    if (!address)
        return "";
    return [
        address.house_number,
        address.street,
        address.subdistrict,
        address.district,
        address.province,
        address.postal_code,
        address.country
    ]
    .filter(part => part)
    .join(', ');
}