MATCH (start:User { name: 'Pure Katerina' }), (end:User {name: 'Long Jeannette'})
CALL apoc.algo.dijkstra(start, end, 'FRIENDS_WITH', "*")
YIELD path, weight
RETURN start.name AS start, [node IN nodes(path) | node.name] AS nodes, end.name AS end, length(path) - 1 AS jumps
