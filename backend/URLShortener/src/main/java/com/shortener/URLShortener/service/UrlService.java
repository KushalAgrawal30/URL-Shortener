package com.shortener.URLShortener.service;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Entity.User;
import com.shortener.URLShortener.Repo.UrlRepository;
import com.shortener.URLShortener.Repo.UserRepository;
import com.shortener.URLShortener.dto.CreateUrlRequest;
import com.shortener.URLShortener.dto.UrlResponse;
import com.shortener.URLShortener.exception.ResourceNotFoundException;
import com.shortener.URLShortener.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    private final RedisTemplate<String, Url> redisTemplate;

    @Value("${app.cache.ttl-minutes}")
    private long cacheTtlMinutes;

    public Url createShortUrl(CreateUrlRequest request, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Url url = Url.builder()
                .longUrl(request.getLongUrl())
                .createdAt(LocalDateTime.now())
                .expiryAt(request.getExpiryAt())
                .active(true)
                .user(user)
                .build();

        url = urlRepository.save(url);

        String shotCode;

        if(request.getCustomAlias()!=null && !request.getCustomAlias().isEmpty()){
            shotCode = request.getCustomAlias();
        }else{
            shotCode = Base62Encoder.encode(url.getId());
        }

        url.setShortCode(shotCode);

        return urlRepository.save(url);
    }


    public Url getUrlByCode(String code){
        String key = "url:"+code;

        Url url = redisTemplate.opsForValue().get(key);
        if(url==null){
            System.out.println("Fetch from DB");
            url = urlRepository.findByShortCode(code)
                    .orElseThrow(() -> new ResourceNotFoundException("URL Not found!"));
            if(url.isActive() && (url.getExpiryAt()!=null && !url.getExpiryAt().isBefore(LocalDateTime.now()))){
                long remainingSeconds = Duration.between(LocalDateTime.now(), url.getExpiryAt()).getSeconds();
                long ttlToUse = Math.min(remainingSeconds, cacheTtlMinutes) + ThreadLocalRandom.current().nextLong(0,30);
                System.out.println(ttlToUse);
                redisTemplate.opsForValue().set(key, url, ttlToUse , TimeUnit.MINUTES);
            }
        }else{
            System.out.println("Fetch from Redis");
        }
        return url;
    }

    public void deactivateUrl(String shortCode, String email){
        Url url = urlRepository.findByShortCodeAndUser_Email(shortCode, email)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));

        url.setActive(false);
        urlRepository.save(url);

        redisTemplate.delete("url:"+shortCode);
    }

    public Page<UrlResponse> getMyUrl(String email, Pageable pageable){
        Page<Url> urls = urlRepository.findByUser_Email(email, pageable);
        return urls.map(url -> UrlResponse.builder()
                .shortCode(url.getShortCode())
                .longUrl(url.getLongUrl())
                .createdAt(url.getCreatedAt())
                .expiryAt(url.getExpiryAt())
                .active(url.isActive())
                .build());
    }

}

