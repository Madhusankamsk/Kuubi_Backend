import express from "express";
import { addMoment, getMoments,getEachMoment,getPost,likeUpdate,disLikeUpdate,getMyMoments,deleteEvent,createPost,getPostFeed,getUserDetails,getWholePosts,interestedUpdate,goingUpdate,contribute,selectLeaderBoard,reactToPhoto} from "../controllers/eventController.js"; // Adjust the path

const router = express.Router();

// Define routes here
router.post("/add", addMoment);
router.post("/get/:id", getMoments);
router.post("/getdata", getEachMoment);
router.get("/getposts", getPost);
router.post("/updatelike", likeUpdate);
router.post("/updatedislike", disLikeUpdate);
router.post("/getmymoments", getMyMoments);
router.delete("/delete/:id", deleteEvent);
router.post("/createpost", createPost);
router.get("/getpostfeed/:id", getPostFeed);
router.get("/getuser/:id", getUserDetails);
//router.post("/createcomment", createComment);
router.get("/getposts/:id", getWholePosts);
router.post("/interested", interestedUpdate);
router.post("/going", goingUpdate);
router.post("/contributes", contribute);
router.get("/leaderboard", selectLeaderBoard);
router.post("/react", reactToPhoto);



export default router;
