package com.havenhub.controller;

import com.havenhub.entity.Booking;
import com.havenhub.entity.User;
import com.havenhub.service.ReceptionistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receptionist")
@RequiredArgsConstructor
@Tag(name = "Receptionist", description = "Receptionist management APIs")
public class ReceptionistController {
    
    private final ReceptionistService receptionistService;
    
    @GetMapping("/bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Get all bookings for receptionist")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(receptionistService.getAllBookings());
    }
    
    @PutMapping("/bookings/{id}/checkin")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Check in guest")
    public ResponseEntity<Booking> checkInGuest(@PathVariable Long id) {
        return ResponseEntity.ok(receptionistService.checkInGuest(id));
    }
    
    @PutMapping("/bookings/{id}/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Check out guest")
    public ResponseEntity<Booking> checkOutGuest(@PathVariable Long id) {
        return ResponseEntity.ok(receptionistService.checkOutGuest(id));
    }
    
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Get all users (read-only)")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(receptionistService.getAllUsers());
    }
}