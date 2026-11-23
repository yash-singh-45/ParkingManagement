package com.project.parking.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.parking.Entity.Ticket;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Entity.Vehicle;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

        Optional<Ticket> findByVehicleAndStatus(
                        Vehicle vehicle,
                        TicketStatus status);

        boolean existsByVehicleAndStatus(
                        Vehicle vehicle,
                        TicketStatus status);

        boolean existsByUid(String uid);

        Optional<Ticket> findByUidAndStatus(String uid, TicketStatus status);

        Optional<Ticket> findByUid(String uid);

        List<Ticket> findByStatus(TicketStatus status);

        List<Ticket> findByVehicle_User_UsernameOrderByEntryTimeDesc(
                        String username);

        long countByStatus(TicketStatus status);

        @Query("""
                            SELECT COALESCE(SUM(t.amount), 0)
                            FROM Ticket t
                            WHERE t.status = :status
                        """)
        BigDecimal getTotalRevenue(@Param("status") TicketStatus status);

        List<Ticket> findByStatusAndExitTimeGreaterThanEqualAndExitTimeLessThan(
                        TicketStatus status,
                        LocalDateTime start,
                        LocalDateTime end);

        List<Ticket> findByVehicle_User_IdOrderByEntryTimeDesc(Long userId);
}