-- Alter the files table to add the isProfilePicture column
ALTER TABLE files
    ADD COLUMN is_profile_picture BOOLEAN NOT NULL;

-- Alter the files table to add the userEmail column
ALTER TABLE files
    ADD COLUMN user_email VARCHAR(128) NOT NULL;

-- Add the foreign key constraint linking user_email in files to email in users
ALTER TABLE files
    ADD CONSTRAINT fk_files_user_email
        FOREIGN KEY (user_email) REFERENCES users(email);