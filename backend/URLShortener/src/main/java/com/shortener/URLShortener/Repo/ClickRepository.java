package com.shortener.URLShortener.Repo;

import com.shortener.URLShortener.Entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickRepository extends JpaRepository<Click, Long> {
    long countByShortCode(String shortCode);
}
