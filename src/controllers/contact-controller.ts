import { NextFunction, Response } from "express";
import { UserRequest } from "../types/user-request";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../models/contact-model";
import { ContactService } from "../services/contact-service";
import { UserResponse } from "../models/user-models";
import { Pageable } from "../models/page";

export class ContactController {
    public static async create(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const response: ContactResponse = await ContactService.create(req.user!, req.body as CreateContactRequest);
            resp.status(200)
                .json({
                    data: response
                })
        } catch(error) {
            next(error);
        }
    }
    public static async get(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const contactId: number = Number(req.params.contactId);
            console.log("contact id : "+contactId);
            
            const response: ContactResponse = await ContactService.getById(req.user!, contactId);
            resp.status(200)
                .json({
                    data: response
                })
        } catch(error) {
            next(error);
        }
    }
    public static async update(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try{
            const updateContactRequest: UpdateContactRequest = req.body as UpdateContactRequest;
            updateContactRequest.id = Number(req.params.contactId);
            const contactResponse: ContactResponse = await ContactService.update(req.user!, updateContactRequest);
            resp.status(200)
                .json({
                    data: contactResponse
                })
        } catch(error) {
            next(error);
        }
    }
    public static async delete(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try{
            const contactId: number = Number(req.params.contactId);
            const response: string = await ContactService.delete(req.user!, contactId);
            resp.status(200)
                .json({
                    data: response
                })
        } catch( error ) {
            next(error);
        }
    }
    public static async search(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const searchRequest: SearchContactRequest = {
                name    : req.query.name as string,
                email   : req.query.email as string,
                phone   : req.query.phone as string,
                page    : req.query.page? Number(req.query.page) : 1,
                size    : req.query.size? Number(req.query.size) : 10
            }
            const pageable: Pageable<ContactResponse> = await ContactService.search(req.user!, searchRequest);
            resp.status(200)
                .json(pageable)
        } catch(error) {
            next(error);
        }
    }
}