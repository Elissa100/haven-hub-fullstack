package com.havenhub.service;

import com.havenhub.dto.BookingRequest;
import com.havenhub.dto.CheckoutRequest;
import com.havenhub.entity.Booking;
import com.havenhub.entity.Notification;
import com.havenhub.entity.Room;
import com.havenhub.entity.User;
import com.havenhub.repository.BookingRepository;
import com.havenhub.repository.RoomRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final PdfService pdfService;

    public List<Booking> getAllBookings() {
        log.info("Fetching all bookings");
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(Long userId) {
        log.info("Fetching bookings for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(user);
    }

    public Booking getBookingById(Long id) {
        log.info("Fetching booking with ID: {}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Booking not found with ID: {}", id);
                    return new RuntimeException("Booking not found with id: " + id);
                });
    }

    public Booking createBooking(BookingRequest bookingRequest, Long userId) {
        log.info("Creating booking for user ID: {} and room ID: {}", userId, bookingRequest.getRoomId());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> {
                    log.error("Room not found with ID: {}", bookingRequest.getRoomId());
                    return new RuntimeException("Room not found");
                });

        // Validate booking duration (minimum 1 hour)
        Duration duration = Duration.between(bookingRequest.getStartDateTime(), bookingRequest.getEndDateTime());
        if (duration.toHours() < 1) {
            log.warn("Booking duration too short: {} hours for user ID: {}", duration.toHours(), userId);
            throw new RuntimeException("Minimum booking duration is 1 hour");
        }

        // Validate start time is not in the past
        if (bookingRequest.getStartDateTime().isBefore(LocalDateTime.now())) {
            log.warn("Start time is in the past for user ID: {}", userId);
            throw new RuntimeException("Start time cannot be in the past");
        }

        // Check for conflicting bookings with hour-level precision
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookingsWithTime(
                room.getId(), bookingRequest.getStartDateTime(), bookingRequest.getEndDateTime());

        if (!conflictingBookings.isEmpty()) {
            log.warn("Room {} has conflicting bookings for the requested time period", room.getRoomNumber());
            throw new RuntimeException("Room is not available for the selected time period");
        }

        // Calculate total amount based on hours
        long hours = duration.toHours();
        BigDecimal hourlyRate = room.getPrice().divide(BigDecimal.valueOf(24)); // Assuming daily rate
        BigDecimal totalAmount = hourlyRate.multiply(BigDecimal.valueOf(hours));

        Booking booking = new Booking();
        booking.setCustomer(user);
        booking.setRoom(room);
        booking.setStartDateTime(bookingRequest.getStartDateTime());
        booking.setEndDateTime(bookingRequest.getEndDateTime());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setTotalAmount(totalAmount);

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {}", savedBooking.getId());

        // Send notifications
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        String startFormatted = bookingRequest.getStartDateTime().format(formatter);
        String endFormatted = bookingRequest.getEndDateTime().format(formatter);

        // Create in-app notification
        notificationService.createNotification(
                user,
                "Booking Created",
                String.format("Your booking for Room %s from %s to %s has been created and is pending approval. Total: $%.2f",
                        room.getRoomNumber(), startFormatted, endFormatted, totalAmount),
                Notification.NotificationType.BOOKING_CREATED
        );

        // Send email notification
        emailService.sendBookingConfirmation(
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                room.getRoomNumber(),
                startFormatted,
                endFormatted
        );

        return savedBooking;
    }

    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        log.info("Updating booking status for ID: {} to status: {}", id, status);
        
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);

        // Send notifications
        User customer = booking.getCustomer();
        String statusMessage = getStatusMessage(status);

        // Create in-app notification
        notificationService.createNotification(
                customer,
                "Booking Status Updated",
                String.format("Your booking for Room %s has been %s.",
                        booking.getRoom().getRoomNumber(), statusMessage),
                getNotificationType(status)
        );

        // Send email notification
        emailService.sendBookingStatusUpdate(
                customer.getEmail(),
                customer.getFirstName() + " " + customer.getLastName(),
                booking.getRoom().getRoomNumber(),
                statusMessage
        );

        log.info("Booking status updated successfully for ID: {}", id);
        return updatedBooking;
    }

    public void deleteBooking(Long id) {
        log.info("Deleting booking with ID: {}", id);
        
        Booking booking = getBookingById(id);

        // Create cancellation notification
        notificationService.createNotification(
                booking.getCustomer(),
                "Booking Cancelled",
                String.format("Your booking for Room %s has been cancelled.",
                        booking.getRoom().getRoomNumber()),
                Notification.NotificationType.BOOKING_CANCELLED
        );

        bookingRepository.delete(booking);
        log.info("Booking deleted successfully with ID: {}", id);
    }

    public Booking initiateCheckout(Long bookingId, CheckoutRequest checkoutRequest) {
        log.info("Initiating checkout for booking ID: {}", bookingId);
        
        Booking booking = getBookingById(bookingId);
        LocalDateTime now = LocalDateTime.now();

        // Check if it's an early checkout request
        if (checkoutRequest.getIsEarlyCheckout() && now.isBefore(booking.getEndDateTime())) {
            log.info("Early checkout requested for booking ID: {}", bookingId);
            booking.setEarlyCheckoutRequested(true);
            booking.setEarlyCheckoutReason(checkoutRequest.getReason());
            
            // Notify admins about early checkout request
            // This would require admin approval logic
            
            return bookingRepository.save(booking);
        }

        // Regular checkout - check if end time has passed
        if (now.isBefore(booking.getEndDateTime())) {
            log.warn("Checkout attempted before end time for booking ID: {}", bookingId);
            throw new RuntimeException("Checkout not allowed before the end of the booking period.");
        }

        // Generate payslip
        byte[] payslipPdf = pdfService.generatePayslip(booking);

        // Send checkout notification with payslip
        emailService.sendCheckoutNotificationWithPayslip(
                booking.getCustomer().getEmail(),
                booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName(),
                booking.getRoom().getRoomNumber(),
                booking.getTotalAmount().toString(),
                payslipPdf
        );

        // Create in-app notification
        notificationService.createNotification(
                booking.getCustomer(),
                "Checkout Required",
                String.format("Your booking for Room %s has ended. Please complete payment of $%.2f to finalize checkout.",
                        booking.getRoom().getRoomNumber(), booking.getTotalAmount()),
                Notification.NotificationType.SYSTEM
        );

        booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
        Booking updatedBooking = bookingRepository.save(booking);
        
        log.info("Checkout initiated successfully for booking ID: {}", bookingId);
        return updatedBooking;
    }

    public Booking completePayment(Long bookingId) {
        log.info("Completing payment for booking ID: {}", bookingId);
        
        Booking booking = getBookingById(bookingId);
        
        if (!booking.getStatus().equals(Booking.BookingStatus.CHECKED_OUT)) {
            log.warn("Payment attempted for booking not in CHECKED_OUT status: {}", bookingId);
            throw new RuntimeException("Booking is not ready for payment");
        }

        booking.setIsPaid(true);
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        
        // Make room available again
        Room room = booking.getRoom();
        room.setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(room);

        Booking updatedBooking = bookingRepository.save(booking);
        
        // Send completion notification
        notificationService.createNotification(
                booking.getCustomer(),
                "Payment Completed",
                String.format("Payment completed for Room %s. Thank you for staying with HavenHub!",
                        booking.getRoom().getRoomNumber()),
                Notification.NotificationType.SYSTEM
        );

        log.info("Payment completed successfully for booking ID: {}", bookingId);
        return updatedBooking;
    }

    public boolean isRoomAvailable(Long roomId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookingsWithTime(
                roomId, startDateTime, endDateTime);
        return conflictingBookings.isEmpty();
    }

    private String getStatusMessage(Booking.BookingStatus status) {
        switch (status) {
            case APPROVED: return "approved";
            case REJECTED: return "rejected";
            case CANCELLED: return "cancelled";
            case COMPLETED: return "completed";
            case CHECKED_OUT: return "checked out";
            default: return "updated";
        }
    }

    private Notification.NotificationType getNotificationType(Booking.BookingStatus status) {
        switch (status) {
            case APPROVED: return Notification.NotificationType.BOOKING_APPROVED;
            case REJECTED: return Notification.NotificationType.BOOKING_REJECTED;
            case CANCELLED: return Notification.NotificationType.BOOKING_CANCELLED;
            default: return Notification.NotificationType.SYSTEM;
        }
    }
}