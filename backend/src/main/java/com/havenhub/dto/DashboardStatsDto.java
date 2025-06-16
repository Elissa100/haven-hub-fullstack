package com.havenhub.dto;

import lombok.Data;

@Data
public class DashboardStatsDto {
    private Long totalRooms;
    private Long availableRooms;
    private Long bookedRooms;
    private Long totalBookings;
    private Long totalUsers;
}