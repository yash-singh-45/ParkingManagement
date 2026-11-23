package com.project.parking.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.parking.Entity.ExitRequest;
import com.project.parking.Entity.ExitRequestStatus;

public interface ExitRequestRepository
        extends JpaRepository<ExitRequest, Long> {

    List<ExitRequest> findByStatusOrderByRequestedAtDesc(
        ExitRequestStatus status
    );

    boolean existsByTicket_IdAndStatus(
        Long ticketId,
        ExitRequestStatus status
    );

    Optional<ExitRequest> findTopByTicket_IdOrderByRequestedAtDesc(Long ticketId);
}