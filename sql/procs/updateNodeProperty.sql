UPDATE nodes 
SET properties = json_set(properties, ?, ?) 
WHERE id=?