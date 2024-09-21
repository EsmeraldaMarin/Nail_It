import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './nailit.db'}
);

