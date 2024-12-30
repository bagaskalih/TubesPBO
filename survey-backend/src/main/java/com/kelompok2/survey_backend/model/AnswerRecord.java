package com.kelompok2.survey_backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "answer_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRecord extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "response_id")
    private SurveyResponse response;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "answer_text")
    private String answerText;

    @ManyToOne
    @JoinColumn(name = "selected_option_id")
    private QuestionOption selectedOption;
}