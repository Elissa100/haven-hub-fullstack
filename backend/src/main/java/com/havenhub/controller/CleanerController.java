package com.havenhub.controller;

import com.havenhub.entity.Room;
import com.havenhub.service.CleanerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cleaner")
@RequiredArgsConstructor
@Tag(name = "Cleaner", description = "Cleaner management APIs")
public class CleanerController {
    
    private final CleanerService cleanerService;
    
    @GetMapping("/rooms")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANER')")
    @Operation(summary = "Get rooms assigned to cleaner")
    public ResponseEntity<List<Room>> getAssignedRooms() {
        return ResponseEntity.ok(cleanerService.getAssignedRooms());
    }
    
    @PutMapping("/rooms/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANER')")
    @Operation(summary = "Update room cleaning status")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Long id,
                                                 @RequestParam Room.RoomStatus status) {
        return ResponseEntity.ok(cleanerService.updateRoomStatus(id, status));
    }
}