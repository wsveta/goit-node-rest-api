import mongoose from "mongoose";
import { config } from 'dotenv';
import { app } from "./app.js";

config();

const { DB_HOST, PORT = 3000 } = process.env;

async function main() {
    try {
        await mongoose.connect(DB_HOST);
        console.log("Database connect successfully")

        app.listen(PORT, () => {
            console.log("Server is running. Use our API on port: 3000");
        });
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

main();