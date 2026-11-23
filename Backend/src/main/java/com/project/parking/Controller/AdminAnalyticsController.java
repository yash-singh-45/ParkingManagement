package com.project.parking.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.AdminAnalyticsResponse;
import com.project.parking.Service.AdminAnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping ("/api/admin/analytics")
@RequiredArgsConstructor 
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping 
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(
                adminAnalyticsService.getAnalytics()
        );
    }
}