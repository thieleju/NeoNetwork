import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/addFriend", async (req: Request, res: Response) => {
  if (!req.body?.user || !req.body?.friend) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const user = JSON.stringify(req.body.user);
  const friend = JSON.stringify(req.body.friend);
  const errors = [];

  const response = await executeQuery(`
    MATCH (u1:User {name: ${user}}), (u2:User {name: ${friend}})
    CREATE (u1)-[:FRIENDS_WITH]->(u2)
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ response });
});

export default router;
