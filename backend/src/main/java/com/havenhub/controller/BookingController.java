package com.havenhub.controller;

import com.havenhub.dto.BookingRequest;
import com.havenhub.dto.CheckoutRequest;
import com.havenhub.entity.Booking;
import com.havenhub.security.UserPrincipal;
import com.havenhub.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Get all bookings (Admin/Manager/Receptionist only)")
    public ResponseEntity<List<Booking>> getAllBookings() {
        log.info("Request to get all bookings");
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get customer's bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Request to get bookings for user ID: {}", userPrincipal.getId());
        return ResponseEntity.ok(bookingService.getBookingsByUser(userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        log.info("Request to get booking by ID: {}", id);
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create new booking (Customer only)")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest bookingRequest,
                                                 @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Request to create booking for user ID: {} and room ID: {}",
                userPrincipal.getId(), bookingRequest.getRoomId());
        return ResponseEntity.ok(bookingService.createBooking(bookingRequest, userPrincipal.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Update booking status (Admin/Manager/Receptionist only)")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id,
                                                       @RequestParam Booking.BookingStatus status) {
        log.info("Request to update booking status for ID: {} to status: {}", id, status);
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/{id}/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Initiate checkout process")
    public ResponseEntity<Booking> initiateCheckout(@PathVariable Long id,
                                                    @RequestBody(required = false) CheckoutRequest checkoutRequest) {
        log.info("Request to initiate checkout for booking ID: {}", id);
        if (checkoutRequest == null) {
            checkoutRequest = new CheckoutRequest();
        }
        return ResponseEntity.ok(bookingService.initiateCheckout(id, checkoutRequest));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Complete payment for booking")
    public ResponseEntity<Booking> completePayment(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("Request to complete payment for booking ID: {} by user ID: {}", id, userPrincipal.getId());
        return ResponseEntity.ok(bookingService.completePayment(id));
    }

    @GetMapping("/room/{roomId}/availability")
    @Operation(summary = "Check room availability for specific time period")
    public ResponseEntity<Boolean> checkRoomAvailability(@PathVariable Long roomId,
                                                         @RequestParam LocalDateTime startDateTime,
                                                         @RequestParam LocalDateTime endDateTime) {
        log.info("Request to check availability for room ID: {} from {} to {}",
                roomId, startDateTime, endDateTime);
        boolean isAvailable = bookingService.isRoomAvailable(roomId, startDateTime, endDateTime);
        return ResponseEntity.ok(isAvailable);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        log.info("Request to delete booking with ID: {}", id);
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}