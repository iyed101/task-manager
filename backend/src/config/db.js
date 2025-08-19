import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
  dialect: "mysql",
  logging: false,
});

export default sequelize;
