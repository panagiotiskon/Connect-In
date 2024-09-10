ALTER TABLE files
    DROP FOREIGN KEY fk_files_user_email;

ALTER TABLE files
    DROP COLUMN user_email;

ALTER TABLE files
    ADD COLUMN user_id BIGINT AFTER is_profile_picture;

ALTER TABLE files
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);