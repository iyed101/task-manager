import Task from "../models/taskModel.js";

// ➕ Ajouter une tâche
export const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📋 Afficher toutes les tâches
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔍 Afficher une seule tâche par ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✏️ Modifier une tâche
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ✅ Compléter une tâche
export const completeTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.complete = true;
        await task.save();

        res.json({ message: "Tâche marquée comme complétée ✅", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❌ Supprimer une tâche
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        await task.destroy();
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
