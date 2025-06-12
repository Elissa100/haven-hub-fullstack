package com.havenhub.service;

import com.havenhub.dto.BookingRequest;
import com.havenhub.entity.Booking;
import com.havenhub.entity.Room;
import com.havenhub.entity.User;
import com.havenhub.repository.BookingRepository;
import com.havenhub.repository.RoomRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByCustomer(user);
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
        
        return bookingRepository.save(booking);
    }
    
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
    
    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }
}