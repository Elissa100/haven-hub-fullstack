package com.havenhub.service;

import com.havenhub.entity.Room;
import com.havenhub.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CleanerService {
    
    private final RoomRepository roomRepository;
    
    public List<Room> getAssignedRooms() {
        // For now, return all rooms. In a real system, you'd filter by assigned cleaner
        return roomRepository.findAll();
    }
    
    public Room updateRoomStatus(Long roomId, Room.RoomStatus status) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        room.setStatus(status);
        return roomRepository.save(room);
    }
}