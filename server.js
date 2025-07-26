import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import sessionRoute from "./routes/sessionRoute.js";
import queRoute from "./routes/queRoute.js";
import { protect } from "./middlewares/authMiddleware.js";
import {
  generateConceptExp,
  generateInterviewQue,
} from "./controllers/aiController.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();
app.use(express.json());

//Route
app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/questions", queRoute);

app.use("/api/ai/generate-questions", protect, generateInterviewQue);
app.use("/api/ai/generate-explanation", protect, generateConceptExp);

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
