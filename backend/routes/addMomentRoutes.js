import express from "express";
import { addMoment, getMoments,getEachMoment,getPost,likeUpdate,disLikeUpdate,getMyMoments} from "../controllers/eventController.js"; // Adjust the path

const router = express.Router();

// Define routes here
router.post("/add", addMoment);
router.get("/get", getMoments);
router.post("/getdata", getEachMoment);
router.get("/getposts", getPost);
router.post("/updatelike", likeUpdate);
router.post("/updatedislike", disLikeUpdate);
router.post("/getmymoments", getMyMoments);


export default router;
