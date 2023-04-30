import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.post("/user", async (req: Request, res: Response) => {
  if (!req.body?.user) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const session = driver.session({
    database: "neo4j",
  });

  let friends;
  let posts;

  const user = JSON.stringify(req.body.user);

  await session
    .run(
      `
      MATCH (u:User {name: ${user}})-[:FRIENDS_WITH]-(f:User)
      RETURN f.name AS friend_name, f.bio AS friend_bio
      UNION
      MATCH (u:User {name: ${user}})<-[:FRIENDS_WITH]-(f:User)
      RETURN f.name AS friend_name, f.bio AS friend_bio
      `
    )
    .then((result) => {
      friends = result.records;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  await session
    .run(
      `
      MATCH (me:User {name: ${user}})-[:POSTED]->(myPosts:Post)
      RETURN me.name AS username, myPosts.title AS title, myPosts.message AS message
      UNION
      MATCH (me:User {name: ${user}})-[:FRIENDS_WITH]-(friend:User)-[:POSTED]->(friendPosts:Post)
      WHERE friend <> me
      RETURN friend.name AS username, friendPosts.title AS title, friendPosts.message AS message
      `
    )
    .then((result) => {
      posts = result.records;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  session.close();

  res.status(200).json({ friends, posts });
});

export default router;
