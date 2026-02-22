package com.shortener.URLShortener.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clicks",
        indexes = {
            @Index(name = "idx_click_short_code", columnList = "shortCode")
        })
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String shortCode;

    @Column(nullable = false, length = 50)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime clickedAt;

    @PrePersist
    protected void onCreate(){
        this.clickedAt = LocalDateTime.now();
    }

}
