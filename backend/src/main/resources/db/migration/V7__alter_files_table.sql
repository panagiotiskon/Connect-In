ALTER TABLE files
    ADD COLUMN post_id INT NULL AFTER user_email,
    ADD CONSTRAINT
        FOREIGN KEY (post_id) REFERENCES posts (id);



