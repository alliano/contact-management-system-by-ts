import supertest from "supertest";
import { ContactTest, UserTest } from "./test-utils"
import { server } from "../src/application/server";
import { Winston } from "../src/application/logging";
import { Contact } from "@prisma/client";

describe("POST /api/contact", function(): void {
    beforeEach(async(): Promise<void> => {
        await UserTest.create()
        await ContactTest.create();
    });
    afterEach(async(): Promise<void> => {
        await ContactTest.deleteMany();
        await UserTest.deleteMany();
    });
    test("Should be able to create contact", async(): Promise<void> => {
        const response = await supertest(server)
            .post("/api/contacts")
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                first_name: "Audia",
                last_name : "Naila Safa",
                email     : "safaAlli@gmail.com",
                phone     : "091234538724"
            });
        Winston.getLogger().debug(response.body)
        expect(response.status).toEqual(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.first_name).toBe("Audia");
        expect(response.body.data.last_name).toBe("Naila Safa");
        expect(response.body.data.email).toBe("safaAlli@gmail.com");
        expect(response.body.data.phone).toBe("091234538724");
    })

    test('Should be reject wehen request is invalid', async(): Promise<void> => {
        const response = await supertest(server)
            .post("/api/contacts")
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                first_name: "",
                last_name : "",
                email     : "safaAlligmail.com",
                phone     : "0912345319801234802138023813208724"
            });
        expect(response.status).toEqual(400);
        expect(response.body.error).toBeDefined();
    })
    test('Should be reject wehen token is invalid', async(): Promise<void> => {
        const response = await supertest(server)
            .post("/api/contacts")
            .set("X-API-TOKEN", "invalid-token")
            .send({
                first_name: "Audia",
                last_name : "Naila Safa",
                email     : "safaAlli@gmail.com",
                phone     : "091234538724"
            });
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })

    test('Should be able get contact by id', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact?.id}`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.body.data.first_name).toBe("Abdillah");
        expect(response.body.data.last_name).toBe("Alli");
        expect(response.status).toEqual(200);
    })
    test('Should can not be able to get contact when id is wrong', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact?.id!+1}`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.body.errors).toBeDefined();
        expect(response.status).toEqual(401);
    })

    test('Should be able to update contact', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact?.id}`)
            .set("X-API-TOKEN", UserTest.getToken())
            .send({
                first_name: contact?.first_name,
                last_name : contact?.last_name,
                email     : "nayla@gmail.com",
                phone     : "081231456382",
            })
        expect(response.status).toEqual(200);
        expect(response.body.data.email).toBe("nayla@gmail.com");
        expect(response.body.data.phone).toBe("081231456382");
        expect(response.body.error).toBeUndefined();
    })
    test('Should can not be able to update when token is wrong', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact?.id}`)
            .set("X-API-TOKEN", "wrong-token")
            .send({
                first_name: contact?.first_name,
                last_name : contact?.last_name,
                email     : "nayla@gmail.com",
                phone     : "081231456382",
            })
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('Should can not be able to update when request is invalid', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact?.id}`)
            .set("X-API-TOKEN", "wrong-token")
            .send({
                first_name: contact?.first_name,
                last_name : contact?.last_name,
                email     : "",
                phone     : "",
            })
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
    test('Should be able to delete contact', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .delete(`/api/contacts/${contact!.id}`)
            .set("X-API-TOKEN", UserTest.getToken())
        expect(response.status).toEqual(200);
        expect(response.body.data).toBe("OK");
        expect(await ContactTest.get()).toBeNull();
    })
    test('Should can not be able to delete contact when id is not found', async(): Promise<void> => {
        const response = await supertest(server)
            .delete(`/api/contacts/100`)
            .set("X-API-TOKEN", UserTest.getToken());
        expect(response.status).toEqual(401);
    })
    test('Should can not be able to delete contact when invalid token', async(): Promise<void> => {
        const contact: Contact | null = await ContactTest.get();
        const response = await supertest(server)
            .delete(`/api/contacts/${contact!.id}`)
            .set("X-API-TOKEN", "invalid-token");
        expect(response.status).toEqual(401);
    })
    test('Should be able to search contact', async(): Promise<void> => {
        const response = await supertest(server)
            .get("/api/contacts")
            .set("X-API-TOKEN", UserTest.getToken());
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    })
    test('Should be able search contact using name', async(): Promise<void> => {
        const response = await supertest(server)
        .get("/api/contacts")
        .set("X-API-TOKEN", UserTest.getToken())
        .query({
            name: "Al"
        });
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].last_name).toBe("Alli");
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    })
    test('Should be able to search contact using email', async(): Promise<void> => {
        const response = await supertest(server)
        .get("/api/contacts")
        .set("X-API-TOKEN", UserTest.getToken())
        .query({
            email: "allianoanonymous@gmail.com"
        });
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].email).toContain("allianoanonymous");
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    });
    test('Should be able to search contact using phone number', async(): Promise<void> => {
        const response = await supertest(server)
        .get("/api/contacts")
        .set("X-API-TOKEN", UserTest.getToken())
        .query({
            phone: "09235283452"
        });
        Winston.getLogger().debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].phone).toBe("09235283452");
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    })
    test('Should be able to search contact using page', async(): Promise<void> => {
        const response = await supertest(server)
            .get("/api/contacts")
            .set("X-API-TOKEN", UserTest.getToken())
            .query({
                page: 2,
                size: 10
            });
        console.log(response.body);
        
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(0);
        expect(response.body.paging.current_page).toEqual(2);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    })
    test('should cant not be able to search contact if token is invalid', async(): Promise<void> => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                name: "Abdillah"
            })
            .set("X-API-TOKEN", "wrong-token");
        expect(response.status).toEqual(401);
    })
})