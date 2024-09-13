CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    connection_user_id BIGINT NOT NULL,
    type ENUM('COMMENT', 'REACTION', 'CONNECTION') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, connection_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (connection_user_id) REFERENCES users(id)
);
