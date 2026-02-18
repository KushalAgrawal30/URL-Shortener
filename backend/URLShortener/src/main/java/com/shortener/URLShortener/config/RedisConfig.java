package com.shortener.URLShortener.config;

import com.shortener.URLShortener.Entity.Url;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Url> redisTemplate(RedisConnectionFactory connectionFactory){
        RedisTemplate<String, Url> template = new RedisTemplate<>();

        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(RedisSerializer.string());

        template.setValueSerializer(RedisSerializer.json());

        template.afterPropertiesSet();
        return template;

    }

}
