ALTER TABLE reactions
    ADD CONSTRAINT unique_user_post
        UNIQUE (user_id, post_id);