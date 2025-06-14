package com.havenhub.service;

import com.havenhub.dto.BookingRequest;
import com.havenhub.entity.Booking;
import com.havenhub.entity.Notification;
import com.havenhub.entity.Room;
import com.havenhub.entity.User;
import com.havenhub.repository.BookingRepository;
import com.havenhub.repository.RoomRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(user);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking createBooking(BookingRequest bookingRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                room.getId(), bookingRequest.getCheckInDate(), bookingRequest.getCheckOutDate());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setCustomer(user);
        booking.setRoom(room);
        booking.setCheckInDate(bookingRequest.getCheckInDate());
        booking.setCheckOutDate(bookingRequest.getCheckOutDate());
        booking.setStatus(Booking.BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Send notifications
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        String checkInFormatted = bookingRequest.getCheckInDate().format(formatter);
        String checkOutFormatted = bookingRequest.getCheckOutDate().format(formatter);

        // Create in-app notification
        notificationService.createNotification(
                user,
                "Booking Created",
                String.format("Your booking for Room %s from %s to %s has been created and is pending approval.",
                        room.getRoomNumber(), checkInFormatted, checkOutFormatted),
                Notification.NotificationType.BOOKING_CREATED
        );

        // Send email notification
        emailService.sendBookingConfirmation(
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                room.getRoomNumber(),
                checkInFormatted,
                checkOutFormatted
        );

        return savedBooking;
    }

    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
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

        return updatedBooking;
    }

    public void deleteBooking(Long id) {
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
    }

    private String getStatusMessage(Booking.BookingStatus status) {
        switch (status) {
            case APPROVED: return "approved";
            case REJECTED: return "rejected";
            case CANCELLED: return "cancelled";
            case COMPLETED: return "completed";
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