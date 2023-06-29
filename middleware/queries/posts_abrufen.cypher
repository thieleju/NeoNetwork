MATCH (me:User { name: ${user }})-[:POSTED]->(myPosts:Post)
RETURN me.name AS username, myPosts.title AS title, myPosts.message AS message
UNION
MATCH (me:User { name: ${user }})-[:FRIENDS_WITH]-(friend:User)-[:POSTED]->(friendPosts:Post)
RETURN friend.name AS username, friendPosts.title AS title, friendPosts.message AS message
