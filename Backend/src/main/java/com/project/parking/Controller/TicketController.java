package com.project.parking.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.MyTicketResponse;
import com.project.parking.Service.TicketService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController 
@RequestMapping("/api/tickets")
@RequiredArgsConstructor 
public class TicketController {

    private final TicketService ticketService;
    @GetMapping("/{uid}")
    public ResponseEntity<MyTicketResponse> getTickeyByUid(@PathVariable String uid) {
        return ResponseEntity.ok(ticketService.getTickeyByUid(uid));
    }
    
}
