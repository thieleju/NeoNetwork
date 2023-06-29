MATCH (source:User)-[r:FRIENDS_WITH]-(target:User)
WITH gds.graph.project('graph',source,target) AS g
RETURN g.graphName AS graph, g.nodeCount AS nodes, g.relationshipCount AS rels

CALL gds.louvain.stream(
  'graph',
  {
    concurrency: 4,
    logProgress: true ,
    maxLevels: 10,
    maxIterations: 10,
    tolerance: 0.0001,
    minCommunitySize: 1
  }
)
YIELD nodeId, communityId
WITH gds.util.asNode(nodeId) AS user, communityId
WITH communityId, collect(user) AS cluster, size(collect(user)) AS clusterSize
  ORDER BY clusterSize DESC
WITH collect(cluster) AS clusters, collect(clusterSize) AS clusterSizes
WITH clusters, clusterSizes, RANGE(size(clusters), 1, -1) AS ranks
UNWIND ranks AS clusterRank
WITH clusterRank, clusterSizes[clusterRank - 1] AS clusterSize, clusters[clusterRank - 1] AS cluster
UNWIND cluster AS user
WITH user, clusterRank, clusterSize
WHERE user.name = 'Julian Thiele'
RETURN user.name AS userName, clusterRank, clusterSize

