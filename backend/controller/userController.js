import { User } from "../model/userModel.js";
import { getAuth, clerkClient } from "@clerk/express";


export const ensureUser = async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const clerkUser = await clerkClient.users.getUser(userId);

    let appUser = await User.findOne({ 
            $or: [
                { clerkId: userId },
                { email: clerkUser.emailAddresses[0]?.emailAddress }
            ]
        });
    if (!appUser) {
      appUser = new User({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
      });
      await appUser.save();
    }

    return res.json({ appUser });

  } catch (error) {
    console.error("Error in ensureUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const appUser = await User.findOne({ clerkId: userId });
    return res.json({ appUser });
  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
