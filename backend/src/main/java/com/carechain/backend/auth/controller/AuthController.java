package com.carechain.backend.auth.controller;

import com.carechain.backend.auth.dto.AuthChallengeRequest;
import com.carechain.backend.auth.dto.AuthVerifyRequest;
import com.carechain.backend.auth.security.AuthenticatedWallet;
import com.carechain.backend.auth.service.AuthService;
import com.carechain.backend.common.api.ApiResponse;
import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/challenge")
    public ApiResponse<Map<String, Object>> createChallenge(@Valid @RequestBody AuthChallengeRequest request) {
        return ApiResponse.ok(authService.createChallenge(request.walletAddress()));
    }

    @PostMapping("/verify")
    public ApiResponse<Map<String, Object>> verify(@Valid @RequestBody AuthVerifyRequest request) {
        return ApiResponse.ok("Wallet verified", authService.verify(
                request.challengeId(),
                request.walletAddress(),
                request.signature(),
                request.message()
        ));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(HttpServletRequest request) {
        AuthenticatedWallet authenticatedWallet =
                (AuthenticatedWallet) request.getAttribute(AuthenticatedWallet.REQUEST_ATTRIBUTE);
        return ApiResponse.ok(authService.currentUser(authenticatedWallet));
    }
}
