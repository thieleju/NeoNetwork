import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/deletePost", async (req: Request, res: Response) => {
  // check if request body is valid
  if (!req.body?.user || !req.body?.title || !req.body?.message) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const user = JSON.stringify(req.body.user);
  const title = JSON.stringify(req.body.title);
  const message = JSON.stringify(req.body.message);
  const errors = [];

  await executeQuery(`
    MATCH (u:User {name: ${user}})-[:POSTED]->(p:Post {title: ${title}, message: ${message}})
    DETACH DELETE p  
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ message: "Deleted Post" });
});

export default router;
