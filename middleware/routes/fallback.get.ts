import express, { Express, Request, Response } from "express";

const router = express.Router();

router.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
