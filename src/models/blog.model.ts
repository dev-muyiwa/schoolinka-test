import {BelongsTo, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./user.model";

@Table
class Blog extends Model {
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
    authorId!: number;

    @BelongsTo(() => User, "authorId")
    author!: User;
}

export default Blog