package com.shortener.URLShortener.service;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.UrlRepository;
import com.shortener.URLShortener.dto.CreateUrlRequest;
import com.shortener.URLShortener.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    private final RedisTemplate<String, Url> redisTemplate;

    @Value("${app.cache.ttl-minutes}")
    private long cacheTtlMinutes;

    public Url createShortUrl(CreateUrlRequest request){
        Url url = Url.builder()
                .longUrl(request.getLongUrl())
                .createdAt(LocalDateTime.now())
                .expiryAt(request.getExpiryAt())
                .active(true)
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
                    .orElseThrow(() -> new RuntimeException("URL Not found!"));
            if(url.isActive() || (url.getExpiryAt()!=null && !url.getExpiryAt().isBefore(LocalDateTime.now()))){
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

}
