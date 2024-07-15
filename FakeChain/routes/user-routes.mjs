import express from 'express';
import {
  about,
  login,
  forgotPassword,
  register,
  resetPassword,
  updatePassword,
  updateUserInfo,
} from '../controllers/user-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/aboutme', protect, about);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/register', register);
router.put('/resetpassword/:token', protect, resetPassword);
router.put('/updateuser', protect, updateUserInfo);
router.put('/updatepassword', protect, updatePassword);

export default router;
