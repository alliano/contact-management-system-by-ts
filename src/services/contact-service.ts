import { Contact, User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, SearchContactRequest, toContactResponse, UpdateContactRequest } from "../models/contact-model";
import { ContactValidation } from "../validations/contact-validation";
import { Validation } from "../validations/validation";
import { connection } from "../application/databases";
import { ErrorResponse } from "../errors/error-response";
import { UserRequest } from "../types/user-request";
import { Pageable } from "../models/page";

export class ContactService {
    // parameter user akan di gunakan untuk megecek melalui Auth Midleware apakah user sudah login
    public static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        const createContactReq = Validation.validate(ContactValidation.CREATE, request);
        const contact: Contact = await connection.contact.create({
            data: ({ ...createContactReq, ...{ username: user.username } })
        })
        return toContactResponse(contact);
    }
    public static async getById(user: User, id: number): Promise<ContactResponse> {
        const contact: Contact | null = await this.checkContactMustExist(user.username, id);
        if(contact !== null) return toContactResponse(contact);
            else
        throw new ErrorResponse(401, `Contact with id ${id} not found!`)
    }
    public static async checkContactMustExist(username: string, id: number): Promise<Contact | null> {
        const contact: Contact | null = await connection.contact.findUnique({
            where: {
                id      : id,
                username: username
            }
        })
        if(contact !== null) return contact;
            else
        throw new ErrorResponse(404,`contact with id ${id} not found!`)
    }
    public static async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
        const updateContactRequest = Validation.validate(ContactValidation.UPDATE, request);
        await this.checkContactMustExist(user.username, updateContactRequest.id);
        const contact: Contact = await connection.contact.update({
            where: {
                username: user.username,
                id: updateContactRequest.id
            },
            data: updateContactRequest
        });
        return toContactResponse(contact);
    }
    public static async delete(user: User, contactId: number): Promise<string> {
        await this.checkContactMustExist(user.username, contactId);
        await connection.contact.delete({
            where: {
                username: user.username,
                id      : contactId
            }
        });
        return "OK";
    }
    public static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request);
        const filters = [];
        // if name exist
        if(searchRequest.name) filters.push({
            OR: [
                {
                    first_name: {
                        contains: searchRequest.name
                    }
                },
                {
                    last_name: {
                        contains: searchRequest.name
                    }
                }
            ]
        })
        // if phone exist
        if(searchRequest.phone) filters.push({
            phone: {
                contains: searchRequest.phone
            }
        })
        // if email exist
        if(searchRequest.email) filters.push({
            email: {
                contains: searchRequest.email
            }
        })
        const skip: number = (searchRequest.page - 1) * searchRequest.size;
        const total: number = await connection.contact.count({
            where: {
                username: user.username,
                AND     : filters
            }
        })
        const contacts: Array<Contact> = await connection.contact.findMany({
            where: {
                username: user.username,
                AND     : filters
            },
            take: searchRequest.size,
            skip: skip
        });
        return {
            data: contacts.map(contact => toContactResponse(contact)),
            paging: {
                total_page  : Math.ceil(total / searchRequest.size),
                current_page: searchRequest.page,
                size        : searchRequest.size
            }
        }
    }
}