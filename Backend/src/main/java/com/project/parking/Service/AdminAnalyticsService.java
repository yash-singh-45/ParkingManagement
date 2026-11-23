package com.project.parking.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.parking.DTOs.AdminAnalyticsResponse;
import com.project.parking.DTOs.DailyRevenueDTO;
import com.project.parking.DTOs.FloorAnalyticsDTO;
import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.Ticket;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Repository.ParkingSlotRepository;
import com.project.parking.Repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class AdminAnalyticsService {

    private final TicketRepository ticketRepository;
    private final ParkingSlotRepository parkingSlotRepository;

    public AdminAnalyticsResponse getAnalytics() {

        AdminAnalyticsResponse response = new AdminAnalyticsResponse();

        // Slot statistics
        long totalSlots = parkingSlotRepository.count();
        long available = parkingSlotRepository
                .findByStatus(SlotStatus.AVAILABLE).size();
        long occupied = parkingSlotRepository
                .findByStatus(SlotStatus.OCCUPIED).size();

        response.setTotalSlots(totalSlots);
        response.setAvailableSlots(available);
        response.setOccupiedSlots(occupied);

        double occupancy = totalSlots == 0
                ? 0
                : (occupied * 100.0) / totalSlots;

        response.setOccupancyPercentage(
                Math.round(occupancy * 100.0) / 100.0
        );

        // Ticket statistics
        long totalEntries = ticketRepository.count();
        long totalExits = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long currentlyParked = ticketRepository.countByStatus(TicketStatus.ACTIVE);

        response.setTotalEntries(totalEntries);
        response.setTotalExits(totalExits);
        response.setCurrentlyParked(currentlyParked);

        // Total revenue from closed tickets
        BigDecimal revenue = ticketRepository
                .getTotalRevenue(TicketStatus.CLOSED);

        response.setTotalRevenue(revenue);

        // Last 7 days revenue
        response.setDailyRevenue(getDailyRevenue());

        // Floor-wise analytics
        response.setFloorAnalytics(getFloorAnalytics());

        return response;
    }

    private List<DailyRevenueDTO> getDailyRevenue() {

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        List<Ticket> tickets = ticketRepository
                .findByStatusAndExitTimeGreaterThanEqualAndExitTimeLessThan(
                        TicketStatus.CLOSED, start, end
                );

        // Initialize all 7 dates with zero revenue
        Map<LocalDate, BigDecimal> revenueMap = new TreeMap<>();

        for (int i = 0; i < 7; i++) {
            revenueMap.put(startDate.plusDays(i), BigDecimal.ZERO);
        }

        // Add revenue from closed tickets
        for (Ticket ticket : tickets) {

            if (ticket.getAmount() == null || ticket.getExitTime() == null) {
                continue;
            }

            LocalDate date = ticket.getExitTime().toLocalDate();

            revenueMap.merge(
                    date,
                    ticket.getAmount(),
                    BigDecimal::add
            );
        }

        return revenueMap.entrySet().stream()
                .map(entry -> new DailyRevenueDTO(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    private List<FloorAnalyticsDTO> getFloorAnalytics() {

        List<ParkingSlot> slots = parkingSlotRepository.findAll();

        Map<String, List<ParkingSlot>> floorMap = slots.stream()
                .collect(Collectors.groupingBy(
                        ParkingSlot::getFloor,
                        TreeMap::new,
                        Collectors.toList()
                ));

        List<FloorAnalyticsDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<ParkingSlot>> entry : floorMap.entrySet()) {

            List<ParkingSlot> floorSlots = entry.getValue();

            long total = floorSlots.size();

            long available = floorSlots.stream()
                    .filter(s -> s.getStatus() == SlotStatus.AVAILABLE)
                    .count();

            long occupied = floorSlots.stream()
                    .filter(s -> s.getStatus() == SlotStatus.OCCUPIED)
                    .count();

            result.add(new FloorAnalyticsDTO(
                    entry.getKey(),
                    total,
                    available,
                    occupied
            ));
        }

        return result;
    }
}