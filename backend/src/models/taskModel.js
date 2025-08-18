import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nomTask: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nomEmploye: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
  tableName: "tasks", // nom de la table dans MySQL
  timestamps: true,   // ajoute createdAt & updatedAt
});

export default Task;
