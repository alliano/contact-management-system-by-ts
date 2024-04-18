import { server } from "./application/server";

const port: number = 8000;
server.listen(port, () => {
    console.log(`The server running on http://localhost:${port}`);
})