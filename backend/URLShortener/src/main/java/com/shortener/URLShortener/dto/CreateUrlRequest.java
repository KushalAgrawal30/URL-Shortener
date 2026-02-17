package com.shortener.URLShortener.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateUrlRequest {
    private String longUrl;
    private String customAlias;
    private LocalDateTime expiryAt;
}
