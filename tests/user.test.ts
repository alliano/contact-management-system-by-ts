import supertest from "supertest";
import { server } from "../src/application/server";
import { Winston } from "../src/application/logging";
import { UserTest } from "./test-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

describe('POST /api/users', function(): void {
    afterEach(async(): Promise<void> => {
        await UserTest.deleteMany();
    });

    beforeEach(async() => {
        await UserTest.create();
    })

    test('should reject register user if request is invalid', async(): Promise<any> => {
        const response = await supertest(server)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name    : ""
            });
            Winston.getLogger().debug(response.body);
            expect(response.status).toEqual(400);
            expect(response.body.errors).toBeUndefined();
    });

    test('Should success Register new User', async(): Promise<void> => {
        const response = await supertest(server)
            .post("/api/users")
            .send({
                username: "alliano",
                password: "some pass",
                name    : "alli"
            });
        Winston.getLogger().debug(response.body);
        expect(response.body.data.name).toBe("alli");
        expect(response.body.data.username).toBe("alliano");
        expect(response.status).toEqual(201);
    })

    test('Should be able to login',async (): Promise<void> => {
        const response = await supertest(server)
            .post("/api/users/login")
            .send({
                username: "naila12",
                password: "test"
            })
        Winston.getLogger().debug(response.body);
        expect(response.body.data.username).toBe("naila12");
        expect(response.body.data.name).toBe("Audia Naila");
        expect(response.status).toEqual(200);
        expect(response.body.data.token).toBeDefined();
    })

    test('Should be rejected if username or password wrong',async (): Promise<void> => {
        const response = await supertest(server)
            .post("/api/users/login")
            .send({
                username: "someuser",
                password: "sample pass"
            })
        Winston.getLogger().error(response.body);
        expect(response.body.errors).toBeDefined();
        expect(response.status).toEqual(401);
    })

    test('Should be rejected if username or password is empty',async (): Promise<void> => {
        const response = await supertest(server)
            .post("/api/users/login")
            .send({
                username: "",
                password: ""
            })
        Winston.getLogger().error(response.body);
        expect(response.body.error).toBeDefined();
        expect(response.status).toEqual(400);
    })
})

describe('GET /api/users', (): void => {
    afterEach(async(): Promise<void> => {
        await UserTest.deleteMany();
    });

    beforeEach(async() => {
        await UserTest.create();
    })
    
    test('Should can be get current User', async(): Promise<void> => {
        const response = await supertest(server)
        .get("/api/users/current")
        .set("X-API-TOKEN", "test-token");
        Winston.getLogger().debug(response.body);
        expect(response.body.data.username).toBe("naila12");
        expect(response.body.data.name).toBe("Audia Naila");
        expect(response.status).toEqual(200);
    })
    test('Should be error when current User with invalid token', async(): Promise<void> => {
        const response = await supertest(server)
        .get("/api/users/current")
            .set("X-API-TOKEN", "wrong-token");
            Winston.getLogger().error(response.body);
            expect(response.status).toEqual(401);
            expect(response.body.errors).toBeDefined();
        })
    })
    
describe('PATCH /api/users/current', function(): void {
    afterEach(async(): Promise<void> => {
        await UserTest.deleteMany();
    });

    beforeEach(async() => {
        await UserTest.create();
    })
    test('Should reject update user when request is invalid', async(): Promise<void> => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test-token")
            .send({
                password: "",
                name    : ""
            });
            Winston.getLogger().debug(response.body);
            expect(response.status).toEqual(400)
            expect(response.body.error).toBeDefined();
        })
        test('Should reject update user when token is invalid', async(): Promise<void> => {
            const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "wrong-token")
            .send({
                password: "some pass valid",
                name    : "Safa"
            });
            Winston.getLogger().debug(response.body);
            expect(response.status).toEqual(401)
            expect(response.body.errors).toBeDefined();
        })
        test('Should be able update current user', async(): Promise<void> => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test-token")
            .send({
                name    : "Safa"
            });
            Winston.getLogger().debug(response.body);
            expect(response.status).toEqual(200)    
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.name).toBe("Safa");
        })

        test('Should be able update both name and password',async (): Promise<void> => {
            const newPassword: string = "new-secreet-pass"
            const response = await supertest(server)
                .patch("/api/users/current")
                .set("X-API-TOKEN", "test-token")
                .send({
                    password: newPassword
                });
            expect(response.status).toEqual(200);
            const user: User | null = await UserTest.get();
            expect(await bcrypt.compare(newPassword, user?.password!));
        })
})

describe('DELETE /api/users/current', function(): void {
    afterEach(async(): Promise<void> => {
        await UserTest.deleteMany();
    });

    beforeEach(async() => {
        await UserTest.create();
    })
    test('Should can be logout',async (): Promise<void> => {
        const response = await supertest(server)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "test-token")
        expect(response.status).toEqual(200);
        const user: User | null = await UserTest.get();
        expect(user?.token).toBeNull();
        expect(response.body.data).toBe("OK")
    })

    test('Should could not be able to logout when wrong token', async(): Promise<void> => {
        const response = await supertest(server)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "wrong-token")
        expect(response.status).toEqual(401);
        expect(response.body.errors).toBeDefined();
    })
})