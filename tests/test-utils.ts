import { Address, Contact, User } from "@prisma/client";
import { connection } from "../src/application/databases";
import bcrypt from "bcrypt";
import { ErrorResponse } from "../src/errors/error-response";
export class UserTest {
    private static readonly token: string = "test-token";
    public static async deleteMany(): Promise<void> {
        await connection.address.deleteMany();
        await connection.address.deleteMany();
        await connection.contact.deleteMany();
        await connection.user.deleteMany();
    }
    public static async create(): Promise<void> {
        await connection.user.create({
            data: {
                username: "naila12",
                name: "Audia Naila",
                password: await bcrypt.hash("test", 10),
                token: this.token
            }
        })
    }
    public static async get(): Promise<User | null> {
        return await connection.user.findFirst({
            where: {
                username: "naila12"
            }
        });
    }
    public static getToken(): string {
        return this.token;
    }
}

export class ContactTest {
    public static async deleteMany(): Promise<void> {
        await connection.contact.deleteMany({
            where: {
                username: "naila12"
            }
        });
    }
    public static async create(): Promise<void> {
        await connection.contact.create({
            data: {
                username: "naila12",
                first_name: "Abdillah",
                last_name: "Alli",
                email: "allianoanonymous@gmail.com",
                phone: "09235283452"
            }
        })
    }
    public static async get(): Promise<Contact | null> {
        return await connection.contact.findFirst({
            where: {
                username: "naila12"
            },
            include: {
                user: true
            }
        })
    }
}
export class AddressTest {
    public static async remove(): Promise<void> {
        await connection.address.deleteMany({});
    }
    public static async create(): Promise<void> {
        const contact: Contact | null = await ContactTest.get();
        await connection.address.create({
            data: {
                contact_id  : contact!.id,
                street      : "Cicagho",
                city        : "Surabaya",
                province    : "Atlantis",
                country     : "Majapahit",
                postal_code : "90342"
            }
        }) 
    }
    public static async get(): Promise<Address> {
        const address: Address | null = await connection.address.findFirst({
            where: {
                contact: {
                    email: "allianoanonymous@gmail.com"
                }
            }
        })
        if(!address) throw new ErrorResponse(404, "address not found");
        return address;
    }
}