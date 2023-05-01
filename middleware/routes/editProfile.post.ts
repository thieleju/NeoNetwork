import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/editProfile", async (req: Request, res: Response) => {
  if (!req.body?.user || !req.body?.bio || !req.body?.new_name) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const user = JSON.stringify(req.body.user);
  const bio = JSON.stringify(req.body.bio);
  const new_name = JSON.stringify(req.body.new_name);
  const errors = [];

  await executeQuery(`
    MATCH (u:User {name: ${user}})
    SET u.bio = ${bio}
    SET u.name = ${new_name}
    RETURN u
    `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ message: "Updated username and bio" });
});

export default router;
