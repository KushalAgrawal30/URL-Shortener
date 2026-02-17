package com.shortener.URLShortener.service;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.UrlRepository;
import com.shortener.URLShortener.dto.CreateUrlRequest;
import com.shortener.URLShortener.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;

    public Url createShortUrl(CreateUrlRequest request){
        Url url = Url.builder()
                .longUrl(request.getLongUrl())
                .createdAt(LocalDateTime.now())
                .expiryAt(request.getExpiryAt())
                .isActive(true)
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

}
