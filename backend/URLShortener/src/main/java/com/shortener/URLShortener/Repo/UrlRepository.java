package com.shortener.URLShortener.Repo;

import com.shortener.URLShortener.Entity.Url;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCode(String shortCode);
    Optional<Url> findByShortCodeAndUser_Email(String shortCode, String email);
    boolean existsByShortCode(String shortCode);
    Page<Url> findByUser_Email(String email, Pageable pageable);
    Page<Url> findByUser_EmailAndActiveTrue(String email, Pageable pageable);
}
