package com.project.parking.Service;

import com.project.parking.Repository.ParkingSlotRepository;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.project.parking.DTOs.ParkingExitRequest;
import com.project.parking.DTOs.ParkingExitResponse;
import com.project.parking.Entity.ExitRequest;
import com.project.parking.Entity.ExitRequestStatus;
import com.project.parking.Entity.ParkingRate;
import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.Ticket;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Repository.ExitRequestRepository;
import com.project.parking.Repository.ParkingRateRepository;
import com.project.parking.Repository.TicketRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingExitService {

        private final ParkingSlotRepository parkingSlotRepository;
        private final TicketRepository ticketRepository;
        private final ParkingRateRepository parkingRateRepository;
        private final ExitRequestRepository exitRequestRepository;

        @Transactional
        public void requestExit(String ticketUid) {

                Ticket ticket = ticketRepository
                                .findByUidAndStatus(ticketUid, TicketStatus.ACTIVE)
                                .orElseThrow(() -> new IllegalStateException("Active ticket not found"));

                boolean alreadyRequested = exitRequestRepository.existsByTicket_IdAndStatus(
                                ticket.getId(),
                                ExitRequestStatus.PENDING);

                if (alreadyRequested) {
                        throw new IllegalStateException(
                                        "An exit request is already pending");
                }

                ExitRequest exitRequest = new ExitRequest();

                exitRequest.setTicket(ticket);
                exitRequest.setStatus(ExitRequestStatus.PENDING);
                exitRequest.setRequestedAt(LocalDateTime.now());

                exitRequestRepository.save(exitRequest);
        }

        private ParkingExitResponse completeExit(Ticket ticket) {

                LocalDateTime exitTime = LocalDateTime.now();

                long hours = Duration.between(
                                ticket.getEntryTime(),
                                exitTime).toHours();

                hours = Math.max(1, hours);

                ParkingRate rate = parkingRateRepository
                                .findBySlotType(ticket.getVehicle().getVehicleType())
                                .orElseThrow(() -> new IllegalStateException(
                                                "Parking rate not configured"));

                BigDecimal amount = rate.getHourlyRate()
                                .multiply(BigDecimal.valueOf(hours));

                // Close ticket
                ticket.setExitTime(exitTime);
                ticket.setAmount(amount);
                ticket.setStatus(TicketStatus.CLOSED);

                // Release slot
                ParkingSlot slot = ticket.getSlot();
                slot.setStatus(SlotStatus.AVAILABLE);

                ticketRepository.save(ticket);
                parkingSlotRepository.save(slot);

                // Response
                ParkingExitResponse response = new ParkingExitResponse();

                response.setTicketUid(ticket.getUid());
                response.setVehicleNumber(
                                ticket.getVehicle().getVehicleNumber());
                response.setSlotNumber(slot.getSlotNumber());
                response.setEntryTime(ticket.getEntryTime());
                response.setExitTime(exitTime);
                response.setAmount(amount);
                response.setVehicleType(
                                ticket.getVehicle().getVehicleType());

                return response;
        }

        @Transactional
        public ParkingExitResponse approveExitRequest(Long requestId) {

                ExitRequest exitRequest = exitRequestRepository
                                .findById(requestId)
                                .orElseThrow(() -> new IllegalStateException(
                                                "Exit request not found"));

                if (exitRequest.getStatus() != ExitRequestStatus.PENDING) {
                        throw new IllegalStateException(
                                        "Exit request already processed");
                }

                Ticket ticket = exitRequest.getTicket();

                if (ticket.getStatus() != TicketStatus.ACTIVE) {
                        throw new IllegalStateException(
                                        "Ticket is no longer active");
                }

                // Execute your existing exit logic
                ParkingExitResponse response = completeExit(ticket);

                exitRequest.setStatus(ExitRequestStatus.APPROVED);
                exitRequest.setProcessedAt(LocalDateTime.now());

                exitRequestRepository.save(exitRequest);

                return response;
        }

        @Transactional
        public void rejectExitRequest(Long requestId) {

                ExitRequest exitRequest = exitRequestRepository
                                .findById(requestId)
                                .orElseThrow(() -> new IllegalStateException(
                                                "Exit request not found"));

                if (exitRequest.getStatus() != ExitRequestStatus.PENDING) {
                        throw new IllegalStateException(
                                        "Exit request already processed");
                }

                exitRequest.setStatus(ExitRequestStatus.REJECTED);
                exitRequest.setProcessedAt(LocalDateTime.now());

                exitRequestRepository.save(exitRequest);
        }
}
