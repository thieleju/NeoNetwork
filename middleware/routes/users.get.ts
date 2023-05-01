import express, { Express, Request, Response } from "express";

import { executeQuery } from "../executeQuery";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  const errors = [];
  const records = await executeQuery(`MATCH (n:User) RETURN n`).catch((error) =>
    errors.push(error)
  );

  if (errors.length > 0)
    res.status(500).json({ message: "Internal Server Error" });
  else res.status(200).json({ records });
});

export default router;
