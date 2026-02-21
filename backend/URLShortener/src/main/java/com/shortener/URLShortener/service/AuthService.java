package com.shortener.URLShortener.service;

import com.shortener.URLShortener.Entity.User;
import com.shortener.URLShortener.Repo.UserRepository;
import com.shortener.URLShortener.security.SecurityBeans;
import com.shortener.URLShortener.dto.AuthResponse;
import com.shortener.URLShortener.dto.LoginRequest;
import com.shortener.URLShortener.dto.RegisterRequest;
import com.shortener.URLShortener.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final SecurityBeans securityBeans;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest registerRequest){
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email already exists!");
        }
        if(userRepository.existsByUsername(registerRequest.getUsername())){
            throw new RuntimeException("Username already exists!");
        }

        String encodedPassword = securityBeans.passwordEncoder().encode(registerRequest.getPassword());

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(encodedPassword)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        if(!securityBeans.passwordEncoder().matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }

        String token = jwtUtil.generateToken(loginRequest.getEmail());

        return new AuthResponse(token);

    }

}
