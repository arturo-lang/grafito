SELECT nodes.id, nodes.tag, nodes.properties, source, target, edges.tag, edges.id AS label
FROM edges 
INNER JOIN nodes
ON nodes.id=edges.source OR nodes.id=edges.target
WHERE (source=? OR target=?) AND (nodes.id<>?)