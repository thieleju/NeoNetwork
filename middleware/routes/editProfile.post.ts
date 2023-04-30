import express, { Express, Request, Response } from "express";

import { driver } from "../neo4jDriver";

const router = express.Router();

router.post("/editProfile", async (req: Request, res: Response) => {
  if (!req.body?.user || !req.body?.bio || !req.body?.new_name) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const session = driver.session({
    database: "neo4j",
  });

  const user = JSON.stringify(req.body.user);
  const bio = JSON.stringify(req.body.bio);
  const new_name = JSON.stringify(req.body.new_name);

  let re;

  await session
    .run(
      `
      MATCH (u:User {name: ${user}})
      SET u.bio = ${bio}
      SET u.name = ${new_name}
      RETURN u
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

  res.status(200).json({ message: "Updated username and bio" });
});

export default router;
