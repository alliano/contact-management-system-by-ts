import { PrismaClient } from "@prisma/client";
import { Winston } from "./logging";

export const connection = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query"
        },
        {
            emit: "event",
            level: "error"
        },
        {
            emit: "event",
            level: "info"
        },
        {
            emit: "event",
            level: "warn"
        }
    ]
});
connection.$on("error", (e) => {
    Winston.getLogger().error(e);
})

connection.$on("warn", (e) => {
    Winston.getLogger().warn(e);
})

connection.$on("info", (e) => {
    Winston.getLogger().info(e);
})

connection.$on("query", (e) => {
    Winston.getLogger().info(e);
})

