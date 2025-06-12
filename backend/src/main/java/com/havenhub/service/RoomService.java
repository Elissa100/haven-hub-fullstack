package com.havenhub.service;

import com.havenhub.dto.RoomRequest;
import com.havenhub.entity.Room;
import com.havenhub.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE);
    }
    
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }
    
    public Room createRoom(RoomRequest roomRequest) {
        if (roomRepository.findByRoomNumber(roomRequest.getRoomNumber()).isPresent()) {
            throw new RuntimeException("Room with number " + roomRequest.getRoomNumber() + " already exists");
        }
        
        Room room = new Room();
        room.setRoomNumber(roomRequest.getRoomNumber());
        room.setType(roomRequest.getType());
        room.setStatus(roomRequest.getStatus());
        room.setPrice(roomRequest.getPrice());
        room.setImageUrl(roomRequest.getImageUrl());
        
        return roomRepository.save(room);
    }
    
    public Room updateRoom(Long id, RoomRequest roomRequest) {
        Room room = getRoomById(id);
        
        room.setRoomNumber(roomRequest.getRoomNumber());
        room.setType(roomRequest.getType());
        room.setStatus(roomRequest.getStatus());
        room.setPrice(roomRequest.getPrice());
        room.setImageUrl(roomRequest.getImageUrl());
        
        return roomRepository.save(room);
    }
    
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }
}