import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  if (!req.body?.from || !req.body?.message || !req.body?.title) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const session = driver.session({
    database: "neo4j",
  });

  let post;

  const user = JSON.stringify(req.body.from);
  const message = JSON.stringify(req.body.message);
  const title = JSON.stringify(req.body.title);

  await session
    .run(
      `
      MATCH (u:User {name: ${user}})
      CREATE (p:Post {title: ${title}, message: ${message}})
      CREATE (u)-[:POSTED]->(p)
      RETURN u, p
      `
    )
    .then((result) => {
      post = result.records;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  session.close();

  res.status(200).json({ post });
});

export default router;
