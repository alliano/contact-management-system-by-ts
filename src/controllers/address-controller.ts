import { NextFunction, Response } from "express";
import { UserRequest } from "../types/user-request";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from "../models/address-model";
import { AddressService } from "../services/address-service";
import { UserResponse } from "../models/user-models";

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
    public static async get(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const getAddressReq: GetAddressRequest = {
                contact_id: Number(req.params.contactId),
                id        : Number(req.params.addressId)
            }
            const addressResponse: AddressResponse = await AddressService.get(req.user!, getAddressReq);
            resp.status(200)
                .json({
                    data : addressResponse
                })
        } catch(error) {
            next(error);
        }
    }
    public static async update(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const updateRequest = req.body as UpdateAddressRequest;
            const { contactId, addressId } = {
                contactId: Number(req.params.contactId),
                addressId: Number(req.params.addressId)
            }
            updateRequest.contact_id = contactId;
            updateRequest.id = addressId;
            const addressResponse: AddressResponse = await AddressService.update(req.user!, updateRequest);
            resp.status(200)
                .json({
                    data: addressResponse
                })
        } catch(error) {
            next(error);
        }
    }
    public static async remove(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const removeRequest: RemoveAddressRequest = {
                contact_id: Number(req.params.contactId),
                id        : Number(req.params.addressId)
            }
            const response: AddressResponse = await AddressService.remove(req.user!, removeRequest);
            resp.status(200)
                .json({
                    data: response
                })
        }catch(error) {
            next(error);
        }
    }
    public static async list(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try{
            resp.status(200)
                .json({
                    data: await AddressService.list(req.user!, Number(req.params.contactId))
                })
        }catch(error) {
            next(error);
        }
    }
}