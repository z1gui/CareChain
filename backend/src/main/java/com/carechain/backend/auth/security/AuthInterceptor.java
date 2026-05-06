package com.carechain.backend.auth.security;

import com.carechain.backend.auth.service.JwtTokenService;
import com.carechain.backend.common.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtTokenService jwtTokenService;

    public AuthInterceptor(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new BusinessException(
                    "Authentication required",
                    "AUTH_TOKEN_INVALID",
                    "Missing Bearer token",
                    HttpStatus.UNAUTHORIZED
            );
        }

        String token = authorization.substring("Bearer ".length()).trim();
        AuthenticatedWallet authenticatedWallet = jwtTokenService.parse(token);
        request.setAttribute(AuthenticatedWallet.REQUEST_ATTRIBUTE, authenticatedWallet);
        return true;
    }
}
