package com.project.parking.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.MyTicketResponse;
import com.project.parking.DTOs.ParkingEntryRequest;
import com.project.parking.Service.ParkingEntryService;
import com.project.parking.Service.ParkingExitService;
import com.project.parking.Service.TicketService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingEntryService parkingEntryService;
    private final ParkingExitService parkingExitService;
    private final TicketService ticketService;

    @PostMapping("/entry")
    public ResponseEntity<MyTicketResponse> getVehicleEntry(@RequestBody ParkingEntryRequest request) {
        return ResponseEntity.ok(parkingEntryService.enterVehicle(request));
    }

    @PostMapping("/exit-request/{ticketUid}")
    public ResponseEntity<String> requestExit(
            @PathVariable String ticketUid) {

        parkingExitService.requestExit(ticketUid);

        return ResponseEntity.ok(
                "Exit request submitted successfully");
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<MyTicketResponse>> getMyTickets(
            Authentication authentication) {
        List<MyTicketResponse> tickets = ticketService.getMyTickets(authentication.getName());
        return ResponseEntity.ok(tickets);
    }

}
