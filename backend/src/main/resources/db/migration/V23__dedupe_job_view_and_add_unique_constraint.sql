ALTER TABLE job_view ADD COLUMN view_count INT NOT NULL DEFAULT 1;

UPDATE job_view jv
JOIN (
    SELECT user_id, job_id, MIN(id) AS keep_id, COUNT(*) AS total_views, MAX(viewed_at) AS latest_viewed_at
    FROM job_view
    GROUP BY user_id, job_id
) d ON jv.id = d.keep_id
SET jv.view_count = d.total_views,
    jv.viewed_at = d.latest_viewed_at;

DELETE jv FROM job_view jv
JOIN (
    SELECT user_id, job_id, MIN(id) AS keep_id
    FROM job_view
    GROUP BY user_id, job_id
) d ON jv.user_id = d.user_id AND jv.job_id = d.job_id
WHERE jv.id <> d.keep_id;

ALTER TABLE job_view ADD CONSTRAINT uq_job_view_user_job UNIQUE (user_id, job_id);
