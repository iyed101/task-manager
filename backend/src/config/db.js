import { Sequelize } from "sequelize";

const sequelize = new Sequelize("task_manager", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // Désactive les logs SQL (optionnel)
});

export default sequelize;
