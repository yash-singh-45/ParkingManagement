package com.project.parking.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.parking.DTOs.ExitRequestResponse;
import com.project.parking.Entity.ExitRequest;
import com.project.parking.Entity.ExitRequestStatus;
import com.project.parking.Repository.ExitRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class ExitRequestService {

    private final ExitRequestRepository exitRequestRepository;

    public List<ExitRequestResponse> getPendingRequests() {

        List<ExitRequest> requests =
                exitRequestRepository.findByStatusOrderByRequestedAtDesc(
                        ExitRequestStatus.PENDING
                );

        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ExitRequestResponse mapToResponse(ExitRequest request) {

        ExitRequestResponse response = new ExitRequestResponse();

        response.setId(request.getId());

        response.setTicketUid(
                request.getTicket().getUid()
        );

        response.setVehicleNumber(
                request.getTicket().getVehicle().getVehicleNumber()
        );

        response.setVehicleType(
                request.getTicket().getVehicle().getVehicleType().name()
        );

        response.setSlotNumber(
                request.getTicket().getSlot().getSlotNumber()
        );

        response.setFloor(
                request.getTicket().getSlot().getFloor()
        );

        response.setZone(
                request.getTicket().getSlot().getZone()
        );

        response.setEntryTime(
                request.getTicket().getEntryTime()
        );

        response.setRequestedAt(
                request.getRequestedAt()
        );

        response.setStatus(
                request.getStatus().name()
        );

        return response;
    }
}