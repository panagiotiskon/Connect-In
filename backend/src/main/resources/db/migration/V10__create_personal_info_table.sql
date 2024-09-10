CREATE TABLE IF NOT EXISTS personal_info
(
    id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS experience
(
    id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    personal_info_id BIGINT,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_public BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_experience_personal_info FOREIGN KEY (personal_info_id) REFERENCES personal_info(id) ON DELETE CASCADE,
    CHECK (end_date IS NULL OR end_date >= start_date)
    );

CREATE TABLE IF NOT EXISTS skill
(
    id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    personal_info_id BIGINT,
    skill_title VARCHAR(255) NOT NULL,
    skill_description TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_skill_personal_info FOREIGN KEY (personal_info_id) REFERENCES personal_info(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS education
(
    id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    personal_info_id BIGINT,
    university_name VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_public BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_education_personal_info FOREIGN KEY (personal_info_id) REFERENCES personal_info(id) ON DELETE CASCADE,
    CHECK (end_date IS NULL OR end_date >= start_date)
    );
