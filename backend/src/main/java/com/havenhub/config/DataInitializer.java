package com.havenhub.config;

import com.havenhub.entity.Role;
import com.havenhub.entity.Room;
import com.havenhub.entity.User;
import com.havenhub.repository.RoleRepository;
import com.havenhub.repository.RoomRepository;
import com.havenhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize roles
        initializeRoles();
        
        // Initialize users
        initializeUsers();
        
        // Initialize sample rooms
        initializeSampleRooms();
    }
    
    private void initializeRoles() {
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }
    
    private void initializeUsers() {
        // Admin user
        if (!userRepository.existsByEmail("admin@havenhub.com")) {
            createUser("Admin", "User", "admin@havenhub.com", "admin123", Role.RoleName.ADMIN);
        }
        
        // Manager user
        if (!userRepository.existsByEmail("manager@havenhub.com")) {
            createUser("Manager", "User", "manager@havenhub.com", "manager123", Role.RoleName.MANAGER);
        }
        
        // Receptionist user
        if (!userRepository.existsByEmail("receptionist@havenhub.com")) {
            createUser("Receptionist", "User", "receptionist@havenhub.com", "receptionist123", Role.RoleName.RECEPTIONIST);
        }
        
        // Cleaner user
        if (!userRepository.existsByEmail("cleaner@havenhub.com")) {
            createUser("Cleaner", "User", "cleaner@havenhub.com", "cleaner123", Role.RoleName.CLEANER);
        }
        
        // Customer user
        if (!userRepository.existsByEmail("customer@havenhub.com")) {
            createUser("Customer", "User", "customer@havenhub.com", "customer123", Role.RoleName.CUSTOMER);
        }
    }
    
    private void createUser(String firstName, String lastName, String email, String password, Role.RoleName roleName) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException(roleName + " role not found"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        
        userRepository.save(user);
    }
    
    private void initializeSampleRooms() {
        if (roomRepository.count() == 0) {
            // Sample rooms with Pexels images
            Room[] sampleRooms = {
                new Room(null, "101", Room.RoomType.SINGLE, Room.RoomStatus.AVAILABLE, 
                        new BigDecimal("99.99"), "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"),
                new Room(null, "102", Room.RoomType.DOUBLE, Room.RoomStatus.AVAILABLE, 
                        new BigDecimal("149.99"), "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"),
                new Room(null, "201", Room.RoomType.SUITE, Room.RoomStatus.AVAILABLE, 
                        new BigDecimal("299.99"), "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"),
                new Room(null, "202", Room.RoomType.DELUXE, Room.RoomStatus.AVAILABLE, 
                        new BigDecimal("399.99"), "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"),
                new Room(null, "301", Room.RoomType.SINGLE, Room.RoomStatus.OCCUPIED, 
                        new BigDecimal("99.99"), "https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg"),
                new Room(null, "302", Room.RoomType.DOUBLE, Room.RoomStatus.MAINTENANCE, 
                        new BigDecimal("149.99"), "https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg")
            };
            
            for (Room room : sampleRooms) {
                roomRepository.save(room);
            }
        }
    }
}