MATCH (user:User { name: ${user } })-[:FRIENDS_WITH]-(friend)-[:FRIENDS_WITH]-(suggestedFriend)
RETURN suggestedFriend.name AS suggestedFriend, COUNT(*) AS mutualFriends
 ORDER BY mutualFriends DESC
LIMIT 10
