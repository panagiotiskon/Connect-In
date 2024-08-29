CREATE TABLE IF NOT EXISTS connections
(
    id           BIGINT PRIMARY KEY,
    user_id_1    BIGINT,
    user_id_2    BIGINT,
    status       ENUM ('PENDING','ACCEPTED'),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users (id) ON DELETE CASCADE
)