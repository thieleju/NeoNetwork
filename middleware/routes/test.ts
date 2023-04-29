import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.get("/test", async (req: Request, res: Response) => {
  const session = driver.session({
    database: "neo4j",
  });

  let records;
  let summary;

  await session
    .run("MATCH (n) RETURN n LIMIT 25")
    .then((result) => {
      records = result.records;
      summary = result.summary;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error from Neo4J Database" });
      return;
    });

  session.close();

  res
    .status(200)
    .json({ message: "Data from Neo4J Database", summary, records });
});

export default router;
