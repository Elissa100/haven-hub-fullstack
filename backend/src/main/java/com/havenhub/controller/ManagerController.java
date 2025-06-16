package com.havenhub.controller;

import com.havenhub.dto.DashboardStatsDto;
import com.havenhub.service.ManagerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
@Tag(name = "Manager", description = "Manager management APIs")
public class ManagerController {
    
    private final ManagerService managerService;
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get manager dashboard stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(managerService.getDashboardStats());
    }
    
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get analytics data")
    public ResponseEntity<Object> getAnalytics() {
        return ResponseEntity.ok(managerService.getAnalytics());
    }
}