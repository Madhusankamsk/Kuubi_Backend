import express from "express";
import { addMoment, getMoments,getEachMoment } from "../controllers/eventController.js"; // Adjust the path

const router = express.Router();

// Define routes here
router.post("/add", addMoment);
router.get("/get", getMoments);
router.post("/getdata", getEachMoment);


export default router;