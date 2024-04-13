import { Address } from "@prisma/client";
export type AddressResponse = {
    id          : number;
    street?     : string;
    city?       : string;
    province?   : string;
    country     : string;
    postal_code : string;
}
export type CreateAddressRequest = {
    contact_id  : number;
    street?     : string;
    city?       : string;
    province?   : string;
    country     : string;
    postal_code : string;
}
export const toAddressResponse = (address: Address) : AddressResponse => {
    return {
        id          : address.id,
        country     : address.country,
        postal_code : address.postal_code,
        city        : address.city!,
        province    : address.province!,
        street      : address.street!
    }
}