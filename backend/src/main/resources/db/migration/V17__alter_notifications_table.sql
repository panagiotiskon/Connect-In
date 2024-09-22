ALTER TABLE notification
    DROP FOREIGN KEY notification_ibfk_1;

ALTER TABLE notification
    DROP INDEX user_id;

ALTER TABLE notification
    ADD CONSTRAINT notification_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id);
