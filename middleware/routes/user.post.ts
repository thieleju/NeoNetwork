import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/user", async (req: Request, res: Response) => {
  // check if request body is valid
  if (!req.body?.user) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const user = JSON.stringify(req.body.user);
  const errors = [];

  const friends = await executeQuery(`
    MATCH (u:User {name: ${user}})-[:FRIENDS_WITH]-(f:User)
    RETURN f.name AS friend_name, f.bio AS friend_bio
  `).catch((error) => errors.push(error));

  const posts = await executeQuery(`
    MATCH (me:User { name: ${user}})-[:POSTED]->(myPosts:Post)
    RETURN me.name AS username, myPosts.title AS title, myPosts.message AS message
    UNION
    MATCH (me:User { name: ${user}})-[:FRIENDS_WITH]-(friend:User)-[:POSTED]->(friendPosts:Post)
    RETURN friend.name AS username, friendPosts.title AS title, friendPosts.message AS message
    `).catch((error) => errors.push(error));

  const role = await executeQuery(`
    MATCH (u:User {name: ${user}})-[:HAS_ROLE]->(r:Role)
    RETURN r
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ friends, posts, role });
});

export default router;
