import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserProfileNotification,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile',updateUserProfile);
router.put('/profilenotify',updateUserProfileNotification);
router.get('/ownerprofile/:id',getUserProfile);
  // .get(protect, getUserProfile)
  // .put(protect, updateUserProfile);

export default router;
