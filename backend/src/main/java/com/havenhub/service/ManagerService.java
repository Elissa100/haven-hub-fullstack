package com.havenhub.service;

import com.havenhub.dto.DashboardStatsDto;
import com.havenhub.repository.BookingRepository;
import com.havenhub.repository.RoomRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManagerService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalRooms(roomRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setTotalUsers(userRepository.count());
        
        // Calculate booked rooms
        Long bookedRooms = bookingRepository.countBookedRooms();
        stats.setBookedRooms(bookedRooms != null ? bookedRooms : 0L);
        stats.setAvailableRooms(stats.getTotalRooms() - stats.getBookedRooms());
        
        return stats;
    }
    
    public Object getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalBookings", bookingRepository.count());
        analytics.put("approvedBookings", bookingRepository.countApprovedBookings());
        analytics.put("totalRooms", roomRepository.count());
        analytics.put("totalUsers", userRepository.count());
        return analytics;
    }
}