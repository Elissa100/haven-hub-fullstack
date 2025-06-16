package com.havenhub.service;

import com.havenhub.entity.Booking;
import com.havenhub.entity.User;
import com.havenhub.repository.BookingRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceptionistService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking checkInGuest(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }
    
    public Booking checkOutGuest(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}