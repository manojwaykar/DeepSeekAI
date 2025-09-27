import OpenAI from "openai";
import { Prompt } from "../model/userPrompt.js";
import { getAuth } from "@clerk/express";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export const createChat = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
    };

    await Prompt.create(chatData);
    return res.status(200).json({ success: true, message: "Chat Created" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


export const sendPrompt = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(400).json({ success: false, error: "User not authenticated" });

    const { content, chatId } = req.body;
    if (!content || content.trim() === "")
      return res.status(400).json({ success: false, error: "Prompt content is required" });

    const chat = await Prompt.findOne({ userId, _id: chatId });
    if (!chat) return res.status(404).json({success: false,  error: "Chat not found" });

    const userMessage = {
      role: "user",
      content,
      timestamp: Date.now(),
    };
    chat.messages.push(userMessage);

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [{ role: "user", content }],
    });

    const aiMessage = {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
    };
    chat.messages.push(aiMessage);

    await chat.save();

    return res.status(200).json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("SendPrompt Error:", error);
    return res.status(500).json({ success: false, error: "Something went wrong!" });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const chats = await Prompt.find({ userId });
    return res.json({ success: true, chats });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { chatId } = req.body;

    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    await Prompt.deleteOne({ _id: chatId, userId });

    return res.status(200).json({ success: true, message: "Chat Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const renameChat = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { chatId, name } = req.body;

    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    await Prompt.findOneAndUpdate({ _id: chatId, userId }, { name });

    return res.status(200).json({ success: true, message: "Chat Renamed" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
