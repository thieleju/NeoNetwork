import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { driver } from "./neo4jDriver";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT;

dotenv.config();

// use cors
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

import users from "./routes/users.get";
import user from "./routes/post.post";
import post from "./routes/user.post";
import addFriend from "./routes/addFriend.post";

import fallback from "./routes/fallback.get";

app.use(users);
app.use(user);
app.use(post);
app.use(addFriend);

app.use(fallback);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// closes the driver when the process is terminated to terminate all network connections
process.on("exit", async () => {
  await driver.close();
});
