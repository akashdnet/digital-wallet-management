import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envList } from "./app/config/envList";
import { createServiceCharge, createSuperAdmin } from "./app/utils/seed";

let server: Server;


const startServer = async () => {
    try {

        await mongoose.connect(envList.DB_URI)

        console.log("YaY!! Connected to DB...");

        server = app.listen(envList.PORT, () => {
            console.log(`Server  is successfully listening to port ${envList.PORT}`);
        });

        // await seed();
        await createSuperAdmin();
        await createServiceCharge();

    } catch (error) {
        console.log(error);
    }
}

startServer()




process.on("SIGTERM", () => {
    console.log("SIGTERM signal detected. Server shutting down.");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})




process.on("SIGINT", () => {
    console.log("SIGINT signal detected. server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})




process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected. server shutting down.", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})



process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected. Server shutting down.", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

