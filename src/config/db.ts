import {Sequelize} from "sequelize-typescript";
import {config} from "./config";
import User from "../models/user.model";


export const dbSetup = async () => {
    const sequelize = new Sequelize({
        dialect: "postgres",
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        username: config.dbUser,
        password: config.dbPassword,
        models: [User],
        logging: false
    });

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Connection to Postgres database was successful.");
        return sequelize;
    } catch (err) {
        throw err;
    }
}