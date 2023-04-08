import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const user: string = process.env.NEO4J_USER || "neo4j";
const password: string = process.env.NEO4J_PASSWORD || "neo4j";

const driver = neo4j.driver(
  `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`,
  neo4j.auth.basic(user, password)
);

// function createNewReadSession() {
//   return driver.session({
//     database: "neo4j",
//     defaultAccessMode: neo4j.session.READ,
//   });
// }

export { driver };
