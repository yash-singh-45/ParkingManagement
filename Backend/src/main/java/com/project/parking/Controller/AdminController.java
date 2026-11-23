package com.project.parking.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.MyTicketResponse;
import com.project.parking.DTOs.OccupiedSlotResponse;
import com.project.parking.DTOs.UserResponse;
import com.project.parking.Service.AdminParkingService;
import com.project.parking.Service.TicketService;
import com.project.parking.Service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AdminParkingService adminParkingService;
    private final TicketService ticketService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/occupied-slots")
    public List<OccupiedSlotResponse> getOccupiedSlots() {
        return adminParkingService.getOccupiedSlots();
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long userId) {

        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<MyTicketResponse>> getUserParkingHistory(
            @PathVariable Long userId) {

                 System.out.println("CONTROLLER REACHED: " + userId);
                 
        return ResponseEntity.ok(
                ticketService.getUserParkingHistory(userId));
    }
}
