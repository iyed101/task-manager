import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask
} from "../controllers/taskController.js";

const router = Router();

// CRUD routes
router.post("/", createTask);       // ➕ Ajouter
router.get("/", getAllTasks);       // 📋 Lire toutes
router.get("/:id", getTaskById);    // 🔍 Lire une
router.put("/:id", updateTask);     // ✏️ Modifier
router.patch("/:id/complete", completeTask); // ✅ Compléter
router.delete("/:id", deleteTask);  // ❌ Supprimer

export default router;
