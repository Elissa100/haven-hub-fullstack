package com.havenhub.controller;

import com.havenhub.dto.UserProfileRequest;
import com.havenhub.entity.User;
import com.havenhub.security.UserPrincipal;
import com.havenhub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<User> updateUserProfile(@Valid @RequestBody UserProfileRequest request,
                                                  @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User updatedUser = userService.updateUserProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/profile/image")
    @Operation(summary = "Upload profile image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String imageUrl = userService.uploadProfileImage(userPrincipal.getId(), file);
        return ResponseEntity.ok(imageUrl);
    }
}