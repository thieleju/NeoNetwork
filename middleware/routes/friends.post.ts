import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/friends", async (req: Request, res: Response) => {
  const { user, otherUser } = req.body;
  if (!user || !otherUser) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const errors = [];

  const records = await executeQuery(`
    MATCH (u1:User {name: "${user}"})-[:FRIENDS_WITH]-(f:User)-[:FRIENDS_WITH]-(u2:User {name: "${otherUser}"})
    RETURN f.name AS common_friend  
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ records });
});

export default router;
