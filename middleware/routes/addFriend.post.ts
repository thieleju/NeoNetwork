import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.post("/addFriend", async (req: Request, res: Response) => {
  if (!req.body?.user || !req.body?.friend) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const session = driver.session({
    database: "neo4j",
  });

  const user = JSON.stringify(req.body.user);
  const friend = JSON.stringify(req.body.friend);

  let re;

  await session
    .run(
      `
      MATCH (u1:User {name: ${user}}), (u2:User {name: ${friend}})
      CREATE (u1)-[:FRIENDS_WITH]->(u2)
      `
    )
    .then((result) => {
      re = result.records;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  session.close();

  res.status(200).json({ response: re });
});

export default router;
