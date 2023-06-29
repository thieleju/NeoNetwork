MATCH (u:User { name: ${user }})-[:FRIENDS_WITH]->(f:User)
RETURN f.name AS friend_name, f.bio AS friend_bio
UNION
MATCH (u:User { name: ${user }})<-[:FRIENDS_WITH]-(f:User)
RETURN f.name AS friend_name, f.bio AS friend_bio

MATCH (u:User { name: ${user }})-[:FRIENDS_WITH]-(f:User)
RETURN f.name AS friend_name, f.bio AS friend_bio
