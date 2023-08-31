import {config} from "./config/config";
import app from "./config/app";
import {dbSetup} from "./config/db";
import {Sequelize} from "sequelize";
import User from "./models/user.model";
import UserModel from "./models/user.model";


const port: number = config.port

export let sequelize: Sequelize;
dbSetup().then((value) => {
    sequelize = value;

    app.listen(port, () => {
        console.log(`Listening to port ${port}...`);
    })
}).catch((err) => {
    console.error("Unable to connect to the Postgres database:", err)
})