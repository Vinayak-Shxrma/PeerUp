import express from "express";
import { addSubject, searchSubjects } from "../controllers/subjectController.js";
const router = express.Router();

router.post("/", addSubject);
router.get("/search", searchSubjects);

export default router;
