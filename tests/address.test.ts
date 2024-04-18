import supertest from "supertest"
import { server } from "../src/application/server"
import { AddressTest, ContactTest, UserTest } from "./test-utils"
import { Address, Contact } from "@prisma/client"
import { Winston } from "../src/application/logging"

describe('/api/addresses', function(): void {
    beforeEach(async(): Promise<void> => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });
    afterEach(async(): Promise<void> => {
        await AddressTest.remove();
        await ContactTest.deleteMany();
        await UserTest.deleteMany();
    });
    test('should can create new addresse', async(): Promise<void> => {
        await AddressTest.remove();
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
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.street).toBe("Cicagho");
        expect(response.body.data.city).toBe("Surabaya");
        expect(response.body.data.province).toBe("Atlantis");
        expect(response.body.data.country).toBe("Majapahit");
        expect(response.body.data.postal_code).toBe("90342");
    })
    test('should be rejected if contact is not found', async(): Promise<void> => {
        const response = await supertest(server)
            .post(`/api/contacts/10/addresses`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "Cicagho",
                city        : "Surabaya",
                province    : "Atlantis",
                country     : "Majapahit",
                postal_code : "90342"
            });
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('should be rejected if request is invalid', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .post(`/api/contacts/${contact?.id}/addresses`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "Cicagho",
                city        : "f",
                province    : "s",
                country     : "",
                postal_code : "90342"
            });
        expect(response.status).toEqual(400);
        expect(response.body.error).toBeDefined();
    })
    test('Should be able to get contact', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address: Address =  await AddressTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact!.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", UserTest.getToken());
        Winston.getLogger().debug(response.body);
        expect(response.body.data.street).toBe("Cicagho");
        expect(response.body.data.city).toBe("Surabaya");
        expect(response.body.data.province).toBe("Atlantis");
        expect(response.body.data.country).toBe("Majapahit");
        expect(response.body.data.postal_code).toBe("90342");
        expect(response.status).toEqual(200);
    })
    test('Should reject get address if id is not found', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address: Address = await AddressTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact!.id}/addresses/${address.id+10}`)
            .set("X-API-TOKEN", UserTest.getToken());
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    });

    test('Should be able to update address', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address:  Address = await AddressTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "Kemayoran",
                city        : "Sukabumi",
                province    : "Jawa Barat",
                country     : "Indonesia",
                postal_code : "99333"
            });
        expect(response.status).toEqual(200);
        expect(response.body.data.street).toBe("Kemayoran");
        expect(response.body.data.city).toBe("Sukabumi");
        expect(response.body.data.province).toBe("Jawa Barat");
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("99333");
    })

    test('Should be reject if token is invalid', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address:  Address = await AddressTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
            .set("X-API-TOKEN", "invalid-token")
            .send({
                street      : "Kemayoran",
                city        : "Sukabumi",
                province    : "Jawa Barat",
                country     : "Indonesia",
                postal_code : "99333"
            });
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('Should be reject if request is invalid', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address:  Address = await AddressTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "",
                city        : "",
                province    : "Jawa Barat",
                country     : "Indonesia",
                postal_code : ""
            });
        expect(response.status).toEqual(400);
        expect(response.body.error).toBeDefined();
    });
    test('Should be reject if address id is not found', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address:  Address = await AddressTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact!.id}/addresses/${address!.id+100}`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                street      : "Kemayoran",
                city        : "Sukabumi",
                province    : "Jawa Barat",
                country     : "Indonesia",
                postal_code : "99333"
            });
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('should can be remove address', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const address: Address = await AddressTest.get();
        const response = await supertest(server)
            .delete(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.status).toEqual(200);
        expect(response.body.data.street).toBe("Cicagho");
        expect(response.body.data.city).toBe("Surabaya");
        expect(response.body.data.province).toBe("Atlantis");
        expect(response.body.data.country).toBe("Majapahit");
        expect(response.body.data.postal_code).toBe("90342");
    })

    test('Should can list all address', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact!.id}/addresses`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
    })
    test('Should reject list all address when contact id is not found', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact!.id+100}/addresses`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('Should reject list all address when invalid token', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact!.id+100}/addresses`)
            .set("X-API-TOKEN", "invalid-token");
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
})