import express from 'express'
import { ensureUser, getProfile } from '../controller/userController.js';
import { requireAuth } from '@clerk/express';


const router = express.Router();

router.post("/ensure-user", requireAuth(), ensureUser);
router.get("/profile", requireAuth(), getProfile);


export default router;