import 'dotenv/config'; // 🔹 doit être en premier
import express from "express";
import sequelize from "./config/db.js";  
import cors from "cors";     
import taskRoutes from "./routes/taskRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173", // pour tester en local
  "https://task-manager-seven-gilt-62.vercel.app", // ton front déployé    
].filter(Boolean);
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // si tu utilises cookies/auth
}));


// Middleware pour parser du JSON
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Route test
app.get("/", (req, res) => {
    res.send("🚀 Hello, mon serveur Express fonctionne !");
});

const startServer = async () => {
    try {
        // Connexion MySQL
        await sequelize.authenticate();
        console.log("✅ Connexion MySQL Railway réussie !");

        // Synchronisation (crée la DB et la table si elles n'existent pas)
        await sequelize.sync({ alter: true }); 
        // ⚠️ alter = met à jour la structure sans tout supprimer
        // utilise { force: true } pour recréer la table à chaque fois

        app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Erreur de connexion DB:", error);
    }
};

startServer();
