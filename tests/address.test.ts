import supertest from "supertest"
import { server } from "../src/application/server"
import { AddressTest, ContactTest, UserTest } from "./test-utils"
import { Contact } from "@prisma/client"
import { CreateContactRequest } from "../src/models/contact-model"
import { CreateAddressRequest } from "../src/models/address-model"

describe('/api/addresses', function(): void {
    beforeEach(async(): Promise<void> => {
        await UserTest.create()
        await ContactTest.create();
    });
    afterEach(async(): Promise<void> => {
        await AddressTest.remove();
        await ContactTest.deleteMany();
        await UserTest.deleteMany();
    });
    test('should can create new addresse', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .post(`/api/contacts/${contact!.id}/addresses`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "Cicagho",
                city        : "Surabaya",
                province    : "Atlantis",
                country     : "Majapahit",
                postal_code : "90342"
            });
        expect(response.status).toEqual(200);
        expect(response.body.data.street).toBe("Cicagho");
        expect(response.body.data.city).toBe("Surabaya");
        expect(response.body.data.province).toBe("Atlantis");
        expect(response.body.data.country).toBe("Majapahit");
        expect(response.body.data.postal_code).toBe("90342");
    })
})