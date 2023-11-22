import { Sequelize } from "sequelize";


export const connectDb: Sequelize = new Sequelize({
 database:process.env.DB_DATABASE || 'sms',
 username: process.env.DB_USERNAME || 'postgres',
password: process.env.DB_PASSWORD || '9192631770abcde',
host: process.env.DB_HOST || 'localhost',
dialect:"postgres",

},
);
