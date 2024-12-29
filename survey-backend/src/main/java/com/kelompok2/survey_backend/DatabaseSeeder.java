package com.kelompok2.survey_backend;

import com.kelompok2.survey_backend.model.SurveyCategory;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.repositories.SurveyCategoryRepository;
import com.kelompok2.survey_backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SurveyCategoryRepository surveyCategoryRepository;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder, SurveyCategoryRepository surveyCategoryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.surveyCategoryRepository = surveyCategoryRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("USER");
            userRepository.save(user);
        }

        if (surveyCategoryRepository.count() == 0) {
            List<SurveyCategory> categories = Arrays.asList(
                    new SurveyCategory(null, "Pengetahuan Umum", new ArrayList<>()),
                    new SurveyCategory(null, "Sejarah", new ArrayList<>()),
                    new SurveyCategory(null, "Matematika", new ArrayList<>()),
                    new SurveyCategory(null, "Ekonomi", new ArrayList<>()),
                    new SurveyCategory(null, "Trivia", new ArrayList<>())
            );

            surveyCategoryRepository.saveAll(categories);
        }
    }
}