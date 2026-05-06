package com.carechain.backend.auth.service;

import com.carechain.backend.auth.config.AuthProperties;
import com.carechain.backend.auth.security.AuthenticatedWallet;
import com.carechain.backend.common.exception.BusinessException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtTokenService {
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    private final AuthProperties authProperties;
    private final ObjectMapper objectMapper;

    public JwtTokenService(AuthProperties authProperties, ObjectMapper objectMapper) {
        this.authProperties = authProperties;
        this.objectMapper = objectMapper;
    }

    public String issueToken(String walletAddress, String walletChain) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = Instant.now()
                .plusSeconds(authProperties.getJwtExpirationMinutes() * 60)
                .getEpochSecond();

        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", walletAddress);
        payload.put("walletAddress", walletAddress);
        payload.put("walletChain", walletChain);
        payload.put("iat", issuedAt);
        payload.put("exp", expiresAt);

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(payload);
        String signingInput = encodedHeader + "." + encodedPayload;
        return signingInput + "." + sign(signingInput);
    }

    public AuthenticatedWallet parse(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw authError("Malformed JWT");
        }

        String signingInput = parts[0] + "." + parts[1];
        String expectedSignature = sign(signingInput);
        if (!constantTimeEquals(expectedSignature, parts[2])) {
            throw authError("JWT signature mismatch");
        }

        Map<String, Object> payload = readJson(parts[1]);
        Number exp = (Number) payload.get("exp");
        String walletAddress = (String) payload.get("walletAddress");
        String walletChain = (String) payload.get("walletChain");
        if (exp == null || walletAddress == null || walletChain == null) {
            throw authError("JWT payload missing required claims");
        }
        if (Instant.now().getEpochSecond() >= exp.longValue()) {
            throw authError("JWT expired");
        }
        return new AuthenticatedWallet(walletAddress, walletChain);
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to encode JWT", ex);
        }
    }

    private Map<String, Object> readJson(String encodedPayload) {
        try {
            byte[] decoded = URL_DECODER.decode(encodedPayload);
            return objectMapper.readValue(decoded, new TypeReference<>() {
            });
        } catch (Exception ex) {
            throw authError("Malformed JWT payload");
        }
    }

    private String sign(String input) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(authProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return URL_ENCODER.encodeToString(mac.doFinal(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to sign JWT", ex);
        }
    }

    private boolean constantTimeEquals(String left, String right) {
        return java.security.MessageDigest.isEqual(
                left.getBytes(StandardCharsets.UTF_8),
                right.getBytes(StandardCharsets.UTF_8)
        );
    }

    private BusinessException authError(String details) {
        return new BusinessException(
                "Authentication failed",
                "AUTH_TOKEN_INVALID",
                details,
                HttpStatus.UNAUTHORIZED
        );
    }
}
