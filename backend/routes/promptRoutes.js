import express from 'express'
import { createChat, deleteChat, getChats, renameChat, sendPrompt } from '../controller/promptController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.post("/chats/prompt", requireAuth() ,sendPrompt);
router.post("/chats",requireAuth(),  createChat);
router.get("/chats", requireAuth(), getChats);
router.delete("/chats",requireAuth(), deleteChat);
router.put("/chats",requireAuth(), renameChat);

export default router;