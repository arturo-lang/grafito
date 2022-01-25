DROP TABLE IF EXISTS nodes;
CREATE TABLE nodes (
    id          INTEGER PRIMARY KEY,
    tag         TEXT,
    properties  JSON NOT NULL
);

CREATE INDEX IF NOT EXISTS node_index ON nodes(id);
CREATE INDEX IF NOT EXISTS node_tag_index ON nodes(tag);

DROP TABLE IF EXISTS edges;
CREATE TABLE edges (
    id          INTEGER PRIMARY KEY,
    tag         TEXT,
    source      INTEGER,
    target      INTEGER,
    direction   INTEGER,
    FOREIGN KEY (source) REFERENCES nodes(id),
    FOREIGN KEY (target) REFERENCES nodes(id)
);

CREATE INDEX IF NOT EXISTS edges_index ON edges(id);
CREATE INDEX IF NOT EXISTS edges_source_index ON edges(source);
CREATE INDEX IF NOT EXISTS edges_target_index ON edges(target);