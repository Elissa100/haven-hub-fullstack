package com.havenhub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    @NotNull(message = "Start date and time is required")
    private LocalDateTime startDateTime;
    
    @NotNull(message = "End date and time is required")
    private LocalDateTime endDateTime;
}