package com.shortener.URLShortener.Controller;

import com.shortener.URLShortener.Entity.Url;
import com.shortener.URLShortener.Repo.UrlRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class UrlRedirect {

    private final UrlRepository urlRepository;

    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {

        Url url = urlRepository.findByShortCode(code)
                .orElseThrow(() -> new RuntimeException("URL Not found!"));

        if(!url.isActive() || (url.getExpiryAt() != null && url.getExpiryAt().isBefore(LocalDateTime.now()))){
            response.sendError(HttpServletResponse.SC_GONE);
            return;
        }
        response.sendRedirect(url.getLongUrl());
    }

}
