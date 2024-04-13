import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, toAddressResponse } from "../models/address-model";
import { Validation } from "../validations/validation";
import { AddressValidation } from "../validations/address-validation";
import { ContactService } from "./contact-service";
import { connection } from "../application/databases";

export class AddressService {
    public static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const createAddressRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExist(user.username, request.contact_id);
        const address: Address = await connection.address.create({
            data: createAddressRequest
        });
        return toAddressResponse(address);
    }
}