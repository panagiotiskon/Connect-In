CREATE TABLE IF NOT EXISTS user
(
    id   BINARY(16) PRIMARY KEY ,
    name VARCHAR(128)
)
    engine = innodb
    DEFAULT charset = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;