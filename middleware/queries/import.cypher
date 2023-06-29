LOAD CSV WITH HEADERS FROM 'file:///data.csv' AS row
CALL {
  WITH row
  MERGE (u:User {name: row.user, flag: "imported"})
  MERGE (r:Role {name: "User"})
  MERGE (u)-[:HAS_ROLE {flag: "imported"}]->(r)
  FOREACH (friendName IN split(row.friends, "|") |
    MERGE (f:User {name: friendName, flag: "imported"})
    MERGE (u)-[:FRIENDS_WITH {flag: "imported"}]->(f)
  )
  FOREACH (postMessage IN split(row.posts, "|") |
    CREATE (u)-[:POSTED {flag: "imported"}]->(:Post {title: "Quote", message: postMessage, flag: "imported"})
  )
  RETURN count(*) AS totalNodes
} IN TRANSACTIONS OF 500 ROWS
RETURN totalNodes


