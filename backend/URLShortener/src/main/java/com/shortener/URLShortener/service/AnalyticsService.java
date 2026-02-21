package com.shortener.URLShortener.service;

import com.shortener.URLShortener.Entity.Click;
import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.ClickRepository;
import com.shortener.URLShortener.Repo.UrlRepository;
import com.shortener.URLShortener.dto.AnalyticsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsService {

//    private final StringRedisTemplate redisTemplate;

    private final ClickRepository clickRepository;
    private final UrlRepository urlRepository;

    public void recordClick(String shortCode, String ip, String userAgent){
        Click click =  Click.builder()
                .shortCode(shortCode)
                .ipAddress(ip)
                .userAgent(userAgent)
                .build();

        click = clickRepository.save(click);
    }

    public AnalyticsResponse getAnalysis(String code, String email){

        Url url = urlRepository.findByShortCodeAndUser_Email(code, email)
                .orElseThrow(() -> new RuntimeException("URL Not found!"));

        long total = clickRepository.countByShortCode(code);
        return AnalyticsResponse.builder()
                .totalClicks(total)
                .build();
    }

}
