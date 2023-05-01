import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  if (!req.body?.from || !req.body?.message || !req.body?.title) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const user = JSON.stringify(req.body.from);
  const message = JSON.stringify(req.body.message);
  const title = JSON.stringify(req.body.title);
  const errors = [];

  const post = await executeQuery(`
    MATCH (u:User {name: ${user}})
    CREATE (p:Post {title: ${title}, message: ${message}})
    CREATE (u)-[:POSTED]->(p)
    RETURN u, p
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ post });
});

export default router;
