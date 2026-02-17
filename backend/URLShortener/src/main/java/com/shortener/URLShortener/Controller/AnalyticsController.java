package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.dto.AnalyticsResponse;
import com.shortener.URLShortener.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{code}/analytics")
    public AnalyticsResponse analyticsClick(@PathVariable String code){
        return analyticsService.getAnalysis(code);
    }

}
