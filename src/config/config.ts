import * as process from "process";
import dotenv from "dotenv";

dotenv.config();
export const config = {
    port: process.env.PORT ? Number(process.env.PORT): 8000,

    dbHost: process.env.DB_HOST || "localhost",
    dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dbName: process.env.DB_NAME || "schoolinka-test",
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,

    jwt_refresh_secret: process.env.REFRESH_SECRET || "refresh secret",
    jwt_access_secret: process.env.ACCESS_SECRET || "access secret",
}