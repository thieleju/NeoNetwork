import { driver } from "./neo4jDriver";

export const executeQuery = async (query: string) => {
  // create session
  const session = driver.session({
    database: "neo4j",
  });

  // use session to run query
  const response = await session.run(query).catch((error) => {
    console.log(`Error from Neo4J Database: ${error}`);
    throw error;
  });

  const count = response?.records.length;
  console.log(`Executed query: ${query} with ${count} returned records`);

  // close session
  session.close();

  // return records
  return response?.records;
};
