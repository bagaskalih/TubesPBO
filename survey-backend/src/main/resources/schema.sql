-- Users table (already exists)
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
    );

-- Survey Categories table
CREATE TABLE survey_categories (
                                   id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                   name VARCHAR(100) NOT NULL UNIQUE
);

-- Surveys table
CREATE TABLE surveys (
                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         title VARCHAR(255) NOT NULL,
                         description TEXT,
                         category_id BIGINT NOT NULL,
                         duration_minutes INT NOT NULL,
                         created_by BIGINT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (category_id) REFERENCES survey_categories(id),
                         FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Questions table
CREATE TABLE questions (
                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                           survey_id BIGINT NOT NULL,
                           question_text TEXT NOT NULL,
                           question_type ENUM('MULTIPLE_CHOICE', 'TEXT', 'RATING') NOT NULL,
                           order_number INT NOT NULL,
                           FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Question Options table (for multiple choice questions)
CREATE TABLE question_options (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  question_id BIGINT NOT NULL,
                                  option_text VARCHAR(255) NOT NULL,
                                  order_number INT NOT NULL,
                                  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Survey Responses table
CREATE TABLE survey_responses (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  survey_id BIGINT NOT NULL,
                                  user_id BIGINT NOT NULL,
                                  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  completed_at TIMESTAMP,
                                  FOREIGN KEY (survey_id) REFERENCES surveys(id),
                                  FOREIGN KEY (user_id) REFERENCES users(id),
                                  UNIQUE KEY unique_survey_user (survey_id, user_id)
);

-- Answer Records table
CREATE TABLE answer_records (
                                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                response_id BIGINT NOT NULL,
                                question_id BIGINT NOT NULL,
                                answer_text TEXT,
                                selected_option_id BIGINT,
                                FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
                                FOREIGN KEY (question_id) REFERENCES questions(id),
                                FOREIGN KEY (selected_option_id) REFERENCES question_options(id)
);

-- Insert default categories
INSERT INTO survey_categories (name) VALUES
                                         ('General Knowledge'),
                                         ('History'),
                                         ('Mathematics'),
                                         ('Economics'),
                                         ('Trivia');