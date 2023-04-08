import express, { Express, Request, Response } from "express";

const router = express.Router();

router.get("/data", (req: Request, res: Response) => {
  res.status(200).json({ message: "Data" });
});

export default router;
