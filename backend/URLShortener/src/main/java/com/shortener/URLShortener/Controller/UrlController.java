package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.dto.CreateUrlRequest;
import com.shortener.URLShortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;


    @PostMapping
    public Url createShortUrl(@RequestBody CreateUrlRequest urlRequest){
        return urlService.createShortUrl(urlRequest);
    }


}
