package com.havenhub.repository;

import com.havenhub.entity.Booking;
import com.havenhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Booking> findByStatus(Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
            "((b.checkInDate <= :checkOut AND b.checkOutDate >= :checkIn) AND " +
            "b.status IN ('APPROVED', 'PENDING'))")
    List<Booking> findConflictingBookings(@Param("roomId") Long roomId,
                                          @Param("checkIn") LocalDate checkIn,
                                          @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'APPROVED'")
    Long countApprovedBookings();

    @Query("SELECT COUNT(DISTINCT b.room.id) FROM Booking b WHERE b.status IN ('APPROVED', 'PENDING')")
    Long countBookedRooms();
}