package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.service.AnalyticsService;
import com.shortener.URLShortener.service.RateLimitService;
import com.shortener.URLShortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UrlRedirect {

    private final AnalyticsService analyticsService;
    private final UrlService urlService;
    private final RateLimitService rateLimitService;

    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code,
                         HttpServletResponse response,
                         HttpServletRequest request) throws IOException {

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        rateLimitService.checkRateLimit("rate:redirect:"+ip, 10, 60);

        Url url = urlService.getUrlByCode(code);

        if(!url.isActive() || (url.getExpiryAt() != null && url.getExpiryAt().isBefore(LocalDateTime.now()))){
            System.out.println(url.isActive());
            throw new ResponseStatusException(HttpStatus.GONE);
        }
        try {
            analyticsService.recordClick(url.getShortCode(), ip, userAgent);
        } catch (Exception e) {
            log.error("Failed to record analytics for for code {}",url.getShortCode());
        }

        response.sendRedirect(url.getLongUrl());
    }

}
