import {Column, DataType, Default, Model, Table} from "sequelize-typescript";

@Table
class Blog extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    content!: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    @Default(0)
    views: number;

    @Column({
        type: DataType.BOOLEAN,
    })
    @Default(false)
    isDraft: boolean;
}

export default Blog