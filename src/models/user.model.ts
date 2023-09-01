import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import Blog from "./blog.model";

@Table
class User extends Model {
    @Column({
        type: DataType.STRING(20),
        allowNull: false
    })
    firstName!: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false
    })
    lastName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.STRING
    })
    refreshToken: string;

    @HasMany(() => Blog, "authorId")
    blogs!: Blog[]
}


export default User;