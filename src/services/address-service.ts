import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, toAddressResponse, UpdateAddressRequest } from "../models/address-model";
import { Validation } from "../validations/validation";
import { AddressValidation } from "../validations/address-validation";
import { ContactService } from "./contact-service";
import { connection } from "../application/databases";
import { ErrorResponse } from "../errors/error-response";
import { toContactResponse } from "../models/contact-model";

export class AddressService {
    public static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const createAddressRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExist(user.username, request.contact_id);
        const address: Address = await connection.address.create({
            data: createAddressRequest
        });
        return toAddressResponse(address);
    }
    public static async checkAddressMustExist(username: string, contactId: number, addressId: number): Promise<Address> {
        const address: Address | null = await connection.address.findUnique({
            where: {
                contact: {
                    username: username
                },
                contact_id: contactId,
                id        : addressId
            }
        });
        if(address == null) throw new ErrorResponse(404, `address with id ${addressId} is not found`);
        return address;
    }
    public static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const getAddressReq = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExist(user.username, getAddressReq.contact_id);
        const address: Address | null = await this.checkAddressMustExist(user.username, request.contact_id, request.id);
        if(!address) throw new ErrorResponse(404, `address with ${getAddressReq.id} is not found`);
        return toAddressResponse(address!);
    }
    public static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const updateRequest: UpdateAddressRequest = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExist(user.username, updateRequest.contact_id);
        await this.checkAddressMustExist(user.username, request.contact_id, request.id);
        const address: Address = await connection.address.update({
            where: {
                contact: {
                    username: user.username
                },
                contact_id: request.contact_id,
                id: request.id,
            },
            data: updateRequest
        })
        return toAddressResponse(address);
    }
    public static async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
        const removeAddressRequest: RemoveAddressRequest = Validation.validate(AddressValidation.DELETE, request);
        await ContactService.checkContactMustExist(user.username, removeAddressRequest.contact_id);
        await this.checkAddressMustExist(user.username, removeAddressRequest.contact_id, removeAddressRequest.id);
        const address: Address = await connection.address.delete({
            where: {
                id: removeAddressRequest.id
            }
        })
        return toAddressResponse(address);
    }
    public static async list(user: User, contactId: number): Promise<Array<AddressResponse>> {
        await ContactService.checkContactMustExist(user.username, contactId);
        const address: Array<Address> = await connection.address.findMany({
            where: {
                contact_id: contactId,
            }
        })
        return address.map(address => toAddressResponse(address));
    }
}