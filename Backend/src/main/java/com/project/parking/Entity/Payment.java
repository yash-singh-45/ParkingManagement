package com.project.parking.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Payment {
    @Id @GeneratedValue
    private Long id;

    @OneToOne
    private Ticket ticket;

    private BigDecimal amount;

    private String paymentMode; 

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String transactionRef;

    private LocalDateTime paidAt;
}   