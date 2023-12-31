import {Sequelize} from "sequelize-typescript";
import {config} from "./config";
import User from "../models/user.model";
import Blog from "../models/blog.model";


export const dbSetup = async () => {
    const sequelize: Sequelize = new Sequelize({
        dialect: "postgres",
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        username: config.dbUser,
        password: config.dbPassword,
        models: [User, Blog],
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