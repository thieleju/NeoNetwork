import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  const session = driver.session({
    database: "neo4j",
  });

  let records;

  await session
    .run("MATCH (n:User) RETURN n")
    .then((result) => {
      records = result.records;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  session.close();

  res.status(200).json({ records });
});

export default router;
