CREATE TABLE posts
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    content      VARCHAR(256) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    post_id      INT          NOT NULL,
    content      VARCHAR(256) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE reactions
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    post_id      INT    NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);
