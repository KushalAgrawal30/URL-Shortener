package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.UrlRepository;
import com.shortener.URLShortener.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UrlRedirect {

    private final UrlRepository urlRepository;
    private final AnalyticsService analyticsService;

    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code,
                         HttpServletResponse response,
                         HttpServletRequest request) throws IOException {

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");


        Url url = urlRepository.findByShortCode(code)
                .orElseThrow(() -> new RuntimeException("URL Not found!"));

        if(!url.isActive() || (url.getExpiryAt() != null && url.getExpiryAt().isBefore(LocalDateTime.now()))){
            response.sendError(HttpServletResponse.SC_GONE);
            return;
        }
        try {
            analyticsService.recordClick(url.getShortCode(), ip, userAgent);
        } catch (Exception e) {
            log.error("Failed to record analytics for for code {}",url.getShortCode());
        }

        response.sendRedirect(url.getLongUrl());
    }

}
