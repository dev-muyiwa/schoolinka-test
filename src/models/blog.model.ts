import {BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import User from "./user.model";
import {ulid} from "ulid";

@Table
class Blog extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        defaultValue: () => ulid(),
    })
    id!: string;

    @Column({
        type: DataType.STRING(64),
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    description: string;

    @Column({
        type: DataType.TEXT({length: "long"}),
        allowNull: false
    })
    content!: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    views: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    isDraft: boolean;

    @ForeignKey(() => User)
    @Column
    authorId!: string;

    @BelongsTo(() => User, "authorId")
    author!: User;
}

export default Blog