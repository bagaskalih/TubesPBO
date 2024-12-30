package com.kelompok2.survey_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String occupation;
    private String education;
    private String birthDate;
    private String gender;
}