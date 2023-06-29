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
  // MATCH (u:User {name: ${user}})-[:POSTED]->(p:Post {title: ${title}, message: ${message}})
  // DETACH DELETE p

  const response = await executeQuery(`
    MATCH (requestingUser:User { name: ${user} })
    WITH requestingUser, EXISTS((requestingUser)-[:HAS_ROLE]->(:Role { name: "admin" })) AS isAdmin

    MATCH (author:User)-[r:POSTED]->(p:Post { title: ${title}, message: ${message} })
    WITH requestingUser, author, isAdmin, p,r, EXISTS((requestingUser)-[:POSTED]->(p)) AS isAuthor

    WHERE isAuthor OR isAdmin
    DELETE p,r

    RETURN requestingUser.name, isAdmin, isAuthor
  `).catch((error) => errors.push(error));

  if (Array.isArray(response) && response.length === 0)
    errors.push("Not allowed!");

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ message: "Deleted Post", response });
});

export default router;
