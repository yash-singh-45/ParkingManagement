package com.project.parking.DTOs;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class AdminAnalyticsResponse {
    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
    private double occupancyPercentage;

    private long totalEntries;
    private long totalExits;
    private long currentlyParked;

    private BigDecimal totalRevenue;

    private List<DailyRevenueDTO> dailyRevenue;
    private List<FloorAnalyticsDTO> floorAnalytics;
}