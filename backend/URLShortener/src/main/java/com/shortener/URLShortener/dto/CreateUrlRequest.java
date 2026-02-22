package com.shortener.URLShortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateUrlRequest {

    @NotBlank(message = "Long URL is required")
    @Pattern(
            regexp = "https?://.*",
            message = "URL must start with http:// or https://"
    )
    private String longUrl;

    @Pattern(
            regexp = "^(|[a-zA-Z0-9_-]{3,20})$",
            message = "Alias must be 3-20 characters and alphanumeric"
    )
    private String customAlias;

    private LocalDateTime expiryAt;
}
