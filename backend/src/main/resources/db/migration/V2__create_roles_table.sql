CREATE TABLE roles (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(255)
);

CREATE TABLE user_roles (
                            user_id BIGINT,
                            role_id INT,

                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (role_id) REFERENCES roles(id)

);

-- Insert admin role
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Insert user role
INSERT INTO roles (name) VALUES ('ROLE_USER');