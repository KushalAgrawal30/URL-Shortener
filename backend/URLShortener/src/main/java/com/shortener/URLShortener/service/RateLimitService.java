package com.shortener.URLShortener.service;

import com.shortener.URLShortener.exception.TooManyRequestsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RedisTemplate<String, String> redisTemplate;

//    private static final int LIMIT = 5;
//    private static final int WINDOW_SECONDS = 60;

    public void checkRateLimit(String key, int limit, int windowSeconds){

        Long count = redisTemplate.opsForValue().increment(key);

        if(count!=null && count==1){
            redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
        }else if(count!=null && count>limit){
            throw new TooManyRequestsException("Rate limit exceeded. Try again later.");
        }
    }

}
