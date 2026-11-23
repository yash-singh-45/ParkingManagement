package com.project.parking.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.ParkingExitResponse;
import com.project.parking.Service.ExitRequestService;
import com.project.parking.Service.ParkingExitService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/admin/exit-requests")
@RequiredArgsConstructor 
public class AdminExitRequestController {

    private final ParkingExitService parkingService;
    private final ExitRequestService exitRequestService;

    @GetMapping 
    public ResponseEntity<?> getPendingRequests() {
        return ResponseEntity.ok(
                exitRequestService.getPendingRequests());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ParkingExitResponse> approve(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                parkingService.approveExitRequest(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> reject(
            @PathVariable Long id) {

        parkingService.rejectExitRequest(id);

        return ResponseEntity.ok(
                "Exit request rejected");
    }
}