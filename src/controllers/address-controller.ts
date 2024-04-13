import { NextFunction, Response } from "express";
import { UserRequest } from "../types/user-request";
import { AddressResponse, CreateAddressRequest } from "../models/address-model";
import { AddressService } from "../services/address-service";

export class AddressController {
    public static async create(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const createAddressRequest: CreateAddressRequest = req.body as CreateAddressRequest;
            createAddressRequest.contact_id = Number(req.params.contactId);
            const addressResponse: AddressResponse = await AddressService.create(req.user!, createAddressRequest);
            resp.status(200)
                .json({
                    data: addressResponse
                })
        } catch( error ) {
            next(error);
        }
    }
}