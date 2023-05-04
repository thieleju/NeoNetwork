import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.post("/sendMsg", async (req: Request, res: Response) => {
  if (!req.body?.from || !req.body?.message || !req.body?.to) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const from = JSON.stringify(req.body.from);
  const message = JSON.stringify(req.body.message);
  const to = JSON.stringify(req.body.to);
  const errors = [];

  const post = await executeQuery(`
  `).catch((error) => errors.push(error));

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ post });
});

export default router;
