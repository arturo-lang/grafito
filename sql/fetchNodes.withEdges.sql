SELECT nodes.id, nodes.tag, nodes.properties
FROM nodes
INNER JOIN edges
ON edges.source=nodes.id
WHERE nodes.tag=? |propies|
GROUP BY nodes.id 
HAVING COUNT( 
    CASE 
        WHEN |edgies|
        THEN 1 
    END 
) |edgeLimit|
COLLATE NOCASE