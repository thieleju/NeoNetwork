MATCH (user:User { name: ${user } })-[:FRIENDS_WITH]-(friend:User)-[:FRIENDS_WITH]-(suggestedFriend:User)
WHERE NOT (user)-[:FRIENDS_WITH]-(suggestedFriend)
RETURN suggestedFriend.name AS suggestedFriend, COUNT(*) AS mutualFriends
 ORDER BY mutualFriends DESC
LIMIT 10
