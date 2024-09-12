ALTER TABLE files
    DROP FOREIGN KEY files_ibfk_1;

ALTER TABLE files
    DROP COLUMN post_id;

ALTER TABLE posts
    ADD COLUMN file_id VARCHAR(36) AFTER content;
