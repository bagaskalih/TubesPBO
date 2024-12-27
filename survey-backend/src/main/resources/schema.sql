USE survey;

CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL
);

CREATE TABLE survey_categories (
                                   id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                   name VARCHAR(100) NOT NULL,
                                   description TEXT
);

CREATE TABLE surveys (
                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         title VARCHAR(255) NOT NULL,
                         description TEXT,
                         category_id BIGINT,
                         duration_minutes INT NOT NULL,
                         created_by BIGINT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (category_id) REFERENCES survey_categories(id),
                         FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE questions (
                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                           survey_id BIGINT,
                           question_text TEXT NOT NULL,
                           question_type VARCHAR(50) NOT NULL,
                           required BOOLEAN DEFAULT TRUE,
                           FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

CREATE TABLE question_options (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  question_id BIGINT,
                                  option_text VARCHAR(255) NOT NULL,
                                  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE survey_responses (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  survey_id BIGINT,
                                  user_id BIGINT,
                                  started_at TIMESTAMP,
                                  completed_at TIMESTAMP,
                                  FOREIGN KEY (survey_id) REFERENCES surveys(id),
                                  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE answer_responses (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  survey_response_id BIGINT,
                                  question_id BIGINT,
                                  answer_text TEXT,
                                  selected_option_id BIGINT,
                                  FOREIGN KEY (survey_response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
                                  FOREIGN KEY (question_id) REFERENCES questions(id),
                                  FOREIGN KEY (selected_option_id) REFERENCES question_options(id)
);

CREATE TABLE notifications (
                               id BIGINT PRIMARY KEY AUTO_INCREMENT,
                               user_id BIGINT,
                               message TEXT NOT NULL,
                               type VARCHAR(50),
                               is_read BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES users(id)
);