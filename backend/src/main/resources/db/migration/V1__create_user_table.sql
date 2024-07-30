CREATE TABLE IF NOT EXISTS users
(
    id           BIGINT PRIMARY KEY NOT NULL,
    email        VARCHAR(128) NOT NULL UNIQUE,
    password     VARCHAR(128) NOT NULL,
    first_name   VARCHAR(128),
    last_name    VARCHAR(128),
    phone_number VARCHAR(20),
    type         ENUM ('ADMIN', 'USER' ),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
        CURRENT_TIMESTAMP

)
    engine = innodb
    DEFAULT charset = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;