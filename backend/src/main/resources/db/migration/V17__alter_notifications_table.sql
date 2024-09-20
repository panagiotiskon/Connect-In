-- Step 1: Drop the foreign key constraint
ALTER TABLE notification
    DROP FOREIGN KEY notification_ibfk_1;

-- Step 2: Drop the index on user_id
ALTER TABLE notification
    DROP INDEX user_id;

-- (Optional) Step 3: Recreate the foreign key constraint (without the unique index)
ALTER TABLE notification
    ADD CONSTRAINT notification_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id);
