package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.UserRepository;
import com.shortener.URLShortener.dto.CreateUrlRequest;
import com.shortener.URLShortener.dto.UrlResponse;
import com.shortener.URLShortener.service.UrlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping
    public Url createShortUrl(@Valid @RequestBody CreateUrlRequest urlRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return urlService.createShortUrl(urlRequest, email);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<?> deleteUrl(@PathVariable String code){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        urlService.deactivateUrl(code, email);

        return ResponseEntity.ok("URL deactivated successfully");
    }

    @GetMapping("/my")
    public Page<UrlResponse> getMyUrl(Pageable pageable){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return urlService.getMyUrl(email, pageable);
    }

}
