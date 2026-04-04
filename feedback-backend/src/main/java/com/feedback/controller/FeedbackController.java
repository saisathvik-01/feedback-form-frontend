package com.feedback.controller;

import com.feedback.dto.DashboardSummaryDto;
import com.feedback.dto.FeedbackRequest;
import com.feedback.dto.FeedbackResponse;
import com.feedback.model.Feedback;
import com.feedback.service.FeedbackService;
import com.feedback.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest,
                                            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            feedbackService.submitFeedback(feedbackRequest, userPrincipal.getId());
            return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Error submitting feedback: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback(
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String academicYear) {

        List<Feedback> feedbacks;
        if (courseId != null || facultyName != null || section != null || semester != null || academicYear != null) {
            feedbacks = feedbackService.getFeedbackWithFilters(courseId, facultyName, section, semester, academicYear);
        } else {
            feedbacks = feedbackService.getAllFeedback();
        }

        List<FeedbackResponse> responses = feedbacks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my-feedback")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedback(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Feedback> feedbacks = feedbackService.getFeedbackByStudentId(userPrincipal.getId());
        List<FeedbackResponse> responses = feedbacks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/faculty/{facultyName}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackForFaculty(
            @PathVariable String facultyName,
            Authentication authentication) {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        if (!userPrincipal.getFacultyName().equals(facultyName)) {
            return ResponseEntity.badRequest().body(List.of());
        }

        List<Feedback> feedbacks = feedbackService.getFeedbackByFacultyName(facultyName);
        List<FeedbackResponse> responses = feedbacks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Error deleting feedback: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(feedbackService.getDashboardSummary());
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY') or hasRole('STUDENT')")
    public ResponseEntity<String> exportFeedbackCsv(Authentication authentication,
                                                    @RequestParam(required = false) String courseId,
                                                    @RequestParam(required = false) String facultyName,
                                                    @RequestParam(required = false) String section,
                                                    @RequestParam(required = false) String semester,
                                                    @RequestParam(required = false) String academicYear) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Feedback> feedbacks;
        if (userPrincipal.getRole() == com.feedback.model.User.Role.STUDENT) {
            feedbacks = feedbackService.getFeedbackByStudentId(userPrincipal.getId());
        } else {
            feedbacks = feedbackService.getFeedbackWithFilters(courseId, facultyName, section, semester, academicYear);
        }

        String filename = "feedback_export.csv";
        String csv = buildCsv(feedbacks);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv);
    }

    private String buildCsv(List<Feedback> feedbacks) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String header = "ID,Student Name,Student Email,Course ID,Course Name,Faculty Name,Section,Semester,Academic Year,Rating,Comment,Submitted At";

        String rows = feedbacks.stream()
                .map(feedback -> String.join(",",
                        safeCsv(String.valueOf(feedback.getId())),
                        safeCsv(feedback.getStudentName()),
                        safeCsv(feedback.getStudentEmail()),
                        safeCsv(feedback.getCourseId()),
                        safeCsv(feedback.getCourseName()),
                        safeCsv(feedback.getFacultyName()),
                        safeCsv(feedback.getSection()),
                        safeCsv(feedback.getSemester()),
                        safeCsv(feedback.getAcademicYear()),
                        safeCsv(String.valueOf(feedback.getRating())),
                        safeCsv(feedback.getComment()),
                        safeCsv(feedback.getCreatedAt() != null ? feedback.getCreatedAt().format(formatter) : "")
                ))
                .collect(Collectors.joining("\n"));

        return header + "\n" + rows;
    }

    private String safeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private FeedbackResponse convertToResponse(Feedback feedback) {
        return new FeedbackResponse(
                feedback.getId(),
                feedback.getStudentName(),
                feedback.getStudentEmail(),
                feedback.getCourseId(),
                feedback.getCourseName(),
                feedback.getFacultyName(),
                feedback.getSection(),
                feedback.getSemester(),
                feedback.getAcademicYear(),
                feedback.getRating(),
                feedback.getRatings(),
                feedback.getComment(),
                feedback.getCreatedAt()
        );
    }
}