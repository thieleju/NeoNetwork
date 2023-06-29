MATCH (u1:User {name: ${user}}), (u2:User {name: ${friend}})
CREATE (u1)-[:FRIENDS_WITH]->(u2)


