package com.shortener.URLShortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Getter
@Builder
@AllArgsConstructor
public class UrlResponse {
    private String shortCode;
    private String longUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiryAt;
    private boolean active;
}
