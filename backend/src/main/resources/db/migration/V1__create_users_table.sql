CREATE TABLE IF NOT EXISTS users
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(128) UNIQUE NOT NULL,
    password     VARCHAR(128) NOT NULL,
    first_name   VARCHAR(128),
    last_name    VARCHAR(128),
    phone_number VARCHAR(20),
    photo_path   VARCHAR(255),
    user_role VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
        CURRENT_TIMESTAMP,
    UNIQUE (email)
)
    engine = innodb
    DEFAULT charset = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;