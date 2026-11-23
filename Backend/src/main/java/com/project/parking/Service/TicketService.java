package com.project.parking.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.project.parking.DTOs.MyTicketResponse;
import com.project.parking.Entity.Ticket;
import com.project.parking.Repository.ExitRequestRepository;
import com.project.parking.Repository.TicketRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ExitRequestRepository exitRequestRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public List<MyTicketResponse> getMyTickets(String username) {

        List<Ticket> tickets = ticketRepository
                .findByVehicle_User_UsernameOrderByEntryTimeDesc(
                        username);

        return tickets.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private MyTicketResponse convertToResponse(Ticket ticket) {

        MyTicketResponse response = new MyTicketResponse();

        response.setTicketUid(ticket.getUid());

        response.setVehicleNumber(
                ticket.getVehicle().getVehicleNumber());

        response.setVehicleType(
                ticket.getVehicle().getVehicleType());

        response.setSlotNumber(
                ticket.getSlot().getSlotNumber());

        response.setFloor(
                ticket.getSlot().getFloor());

        response.setZone(
                ticket.getSlot().getZone());

        response.setEntryTime(ticket.getEntryTime());
        response.setExitTime(ticket.getExitTime());
        response.setAmount(ticket.getAmount());
        response.setStatus(ticket.getStatus());

        // Get the latest exit request status
        exitRequestRepository
                .findTopByTicket_IdOrderByRequestedAtDesc(ticket.getId())
                .ifPresent(request -> response.setExitRequestStatus(request.getStatus()));

        return response;
    }

    public String getTicketUid(int len) {

        Random random = new Random();

        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        int l = str.length() - 1;

        while (true) {
            StringBuilder uid = new StringBuilder();

            for (int i = 0; i < len; i++) {
                int idx = random.nextInt((l - 0) + 1) + 0;
                uid.append(str.charAt(idx));
            }

            String res = uid.toString();

            if (!ticketRepository.existsByUid(res)) {
                return res;
            }
        }
    }

    public MyTicketResponse getTickeyByUid(String uid) {
        Ticket ticket = ticketRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Ticket does not exist with given uid"));

        return convertToResponse(ticket);
    }

    public List<MyTicketResponse> getUserParkingHistory(Long userId) {

    System.out.println("Fetching parking history for user: " + userId);

    List<Ticket> tickets =
    ticketRepository.findByVehicle_User_IdOrderByEntryTimeDesc(userId);

    System.out.println("Tickets found: " + tickets.size());

    return tickets.stream()
    .map(ticket -> {
    MyTicketResponse response = modelMapper.map(ticket, MyTicketResponse.class);

    response.setVehicleNumber(
    ticket.getVehicle().getVehicleNumber());

    response.setVehicleType(
    ticket.getVehicle().getVehicleType());

    response.setSlotNumber(
    ticket.getSlot().getSlotNumber());

    response.setFloor(
    ticket.getSlot().getFloor());

    response.setZone(
    ticket.getSlot().getZone());

    return response;
    })
    .toList();
    }

    // public List<MyTicketResponse> getUserParkingHistory(Long userId) {

    //     System.out.println("STEP 1: Fetching tickets for user " + userId);

    //     List<Ticket> tickets = ticketRepository.findByVehicle_User_IdOrderByEntryTimeDesc(userId);

    //     System.out.println("STEP 2: Tickets found: " + tickets.size());

    //     List<MyTicketResponse> result = tickets.stream()
    //             .map(ticket -> {
    //                 MyTicketResponse response = modelMapper.map(ticket, MyTicketResponse.class);

    //                 response.setTicketUid(ticket.getUid());
    //                 response.setVehicleNumber(ticket.getVehicle().getVehicleNumber());
    //                 response.setVehicleType(ticket.getVehicle().getVehicleType());

    //                 return response;
    //             })
    //             .toList();
    //     System.out.println("STEP 3: Mapping completed");

    //     return result;
    // }
}
