MATCH (requestingUser:User { name: "${user}" })
WITH requestingUser, EXISTS((requestingUser)-[:HAS_ROLE]->(:Role { name: "admin" })) AS isAdmin

MATCH (author:User)-[:POSTED]->(p:Post { title: "${title}", message: "${message}" })
WITH requestingUser, author, isAdmin, p, EXISTS((requestingUser)-[:POSTED]->(p)) AS isAuthor

WHERE isAuthor OR isAdmin
DELETE p

RETURN requestingUser.name, isAdmin, isAuthor
