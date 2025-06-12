package com.havenhub.dto;

import com.havenhub.entity.Room;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomRequest {
    @NotBlank
    private String roomNumber;
    
    @NotNull
    private Room.RoomType type;
    
    @NotNull
    private Room.RoomStatus status;
    
    @NotNull
    @Positive
    private BigDecimal price;
    
    private String imageUrl;
}