package com.feedback.controller;

import com.feedback.dto.AuthResponse;
import com.feedback.dto.LoginRequest;
import com.feedback.dto.SignupRequest;
import com.feedback.model.User;
import com.feedback.service.AuthService;
import com.feedback.security.JwtUtils;
import com.feedback.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    // Validation regexes
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^\\d{10}@kluniversity\\.in$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$");

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validate input format
            String identifier = loginRequest.getIdentifier();
            if (!USERNAME_PATTERN.matcher(identifier).matches() &&
                !EMAIL_PATTERN.matcher(identifier).matches()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Enter valid Username (10-digit ID) or University Email"));
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateToken(authentication);

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getRole(),
                userDetails.getFacultyName(),
                userDetails.getSection()));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid credentials"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Map<String, String> errors = new HashMap<>();

        // Validate username
        if (signUpRequest.getUsername() != null && !USERNAME_PATTERN.matcher(signUpRequest.getUsername()).matches()) {
            errors.put("username", "Username must be exactly 10 digits");
        }

        // Validate email
        if (!EMAIL_PATTERN.matcher(signUpRequest.getEmail()).matches()) {
            errors.put("email", "Email must be in format: 1234567890@kluniversity.in");
        }

        // Validate password
        if (!PASSWORD_PATTERN.matcher(signUpRequest.getPassword()).matches()) {
            errors.put("password", "Password must be 8+ characters with uppercase, number, and special character");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        // Check if username or email already exists
        if (signUpRequest.getUsername() != null && authService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Username is already taken!"));
        }

        if (authService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email is already in use!"));
        }

        // Create new user account
        User user = new User(signUpRequest.getUsername(),
                           signUpRequest.getEmail(),
                           signUpRequest.getPassword(), // Password will be encoded in service
                           signUpRequest.getRole());
        user.setFacultyName(signUpRequest.getFacultyName());
        user.setSection(signUpRequest.getSection());

        authService.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}