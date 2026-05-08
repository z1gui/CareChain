package com.carechain.backend.auth.service;

import com.carechain.backend.auth.config.AuthProperties;
import com.carechain.backend.auth.model.AuthChallenge;
import com.carechain.backend.auth.model.AuthUser;
import com.carechain.backend.auth.repository.AuthChallengeRepository;
import com.carechain.backend.auth.repository.AuthUserRepository;
import com.carechain.backend.auth.security.AuthenticatedWallet;
import com.carechain.backend.common.exception.BusinessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthProperties authProperties;
    private final AuthChallengeRepository authChallengeRepository;
    private final AuthUserRepository authUserRepository;
    private final SolanaSignatureVerifier solanaSignatureVerifier;
    private final JwtTokenService jwtTokenService;

    public AuthService(
            AuthProperties authProperties,
            AuthChallengeRepository authChallengeRepository,
            AuthUserRepository authUserRepository,
            SolanaSignatureVerifier solanaSignatureVerifier,
            JwtTokenService jwtTokenService
    ) {
        this.authProperties = authProperties;
        this.authChallengeRepository = authChallengeRepository;
        this.authUserRepository = authUserRepository;
        this.solanaSignatureVerifier = solanaSignatureVerifier;
        this.jwtTokenService = jwtTokenService;
    }

    public Map<String, Object> createChallenge(String walletAddress) {
        OffsetDateTime issuedAt = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime expiredAt = issuedAt.plusMinutes(authProperties.getChallengeTtlMinutes());
        String nonce = UUID.randomUUID().toString();
        String challengeId = "chl_" + UUID.randomUUID();
        String message = buildMessage(walletAddress, nonce, issuedAt, expiredAt);
        AuthChallenge challenge = new AuthChallenge(
                challengeId,
                walletAddress,
                nonce,
                message,
                "PENDING",
                issuedAt,
                expiredAt
        );
        authChallengeRepository.save(
                challenge,
                Duration.ofMinutes(authProperties.getChallengeTtlMinutes())
        );
        return Map.of(
                "challengeId", challengeId,
                "walletAddress", walletAddress,
                "nonce", nonce,
                "message", message,
                "expiredAt", expiredAt.toString()
        );
    }

    public Map<String, Object> verify(String challengeId, String walletAddress, String signature, String message) {
        AuthChallenge challenge = authChallengeRepository.findById(challengeId)
                .orElseThrow(() -> authError(
                        "Invalid authentication challenge",
                        "AUTH_CHALLENGE_NOT_FOUND",
                        "challengeId not found"
                ));

        if (OffsetDateTime.now(ZoneOffset.UTC).isAfter(challenge.expiredAt())) {
            authChallengeRepository.delete(challengeId);
            throw authError(
                    "Authentication challenge expired",
                    "AUTH_CHALLENGE_EXPIRED",
                    "challengeId expired"
            );
        }
        if (!"PENDING".equals(challenge.status())) {
            throw authError(
                    "Authentication challenge already used",
                    "AUTH_CHALLENGE_USED",
                    "challengeId has already been consumed"
            );
        }
        if (!challenge.walletAddress().equals(walletAddress)) {
            throw authError(
                    "Wallet mismatch",
                    "AUTH_WALLET_MISMATCH",
                    "walletAddress does not match the original challenge"
            );
        }
        if (!challenge.message().equals(message)) {
            throw authError(
                    "Authentication message mismatch",
                    "AUTH_SIGNATURE_INVALID",
                    "Signed message does not match the issued challenge"
            );
        }
        if (!solanaSignatureVerifier.verify(walletAddress, message, signature)) {
            throw authError(
                    "Authentication signature invalid",
                    "AUTH_SIGNATURE_INVALID",
                    "Unable to verify Solana message signature"
            );
        }
        if (!authChallengeRepository.markUsed(challengeId)) {
            throw authError(
                    "Authentication challenge already used",
                    "AUTH_CHALLENGE_USED",
                    "challengeId was already consumed"
            );
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        boolean isNewUser = upsertAuthenticatedUser(walletAddress, now);

        String accessToken = jwtTokenService.issueToken(walletAddress, "SOLANA");
        return Map.of(
                "walletAddress", walletAddress,
                "walletChain", "SOLANA",
                "accessToken", accessToken,
                "expiresIn", authProperties.getJwtExpirationMinutes() * 60,
                "isNewUser", isNewUser
        );
    }

    public Map<String, Object> currentUser(AuthenticatedWallet authenticatedWallet) {
        if (authenticatedWallet == null) {
            throw new BusinessException(
                    "Authentication required",
                    "AUTH_TOKEN_INVALID",
                    "No authenticated wallet was found",
                    HttpStatus.UNAUTHORIZED
            );
        }

        AuthUser authUser = authUserRepository.findByWalletAddress(authenticatedWallet.walletAddress())
                .orElseThrow(() -> authError(
                        "Authenticated user not found",
                        "AUTH_TOKEN_INVALID",
                        "walletAddress does not exist"
                ));

        return Map.of(
                "walletAddress", authUser.walletAddress(),
                "displayWallet", displayWallet(authUser.walletAddress()),
                "walletChain", authUser.walletChain(),
                "status", authUser.status(),
                "createdAt", authUser.createdAt().toString(),
                "lastLoginAt", authUser.lastLoginAt().toString()
        );
    }

    private String buildMessage(
            String walletAddress,
            String nonce,
            OffsetDateTime issuedAt,
            OffsetDateTime expiredAt
    ) {
        return "CareChain wants you to sign in with your Solana account.\n"
                + authProperties.getMessageStatement() + "\n"
                + "wallet=" + walletAddress + "\n"
                + "nonce=" + nonce + "\n"
                + "issuedAt=" + issuedAt + "\n"
                + "expiredAt=" + expiredAt;
    }

    private String displayWallet(String walletAddress) {
        if (walletAddress.length() <= 10) {
            return walletAddress;
        }
        return walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length() - 4);
    }

    private BusinessException authError(String message, String code, String details) {
        return new BusinessException(message, code, details, HttpStatus.UNAUTHORIZED);
    }

    private boolean upsertAuthenticatedUser(String walletAddress, OffsetDateTime now) {
        Optional<AuthUser> existingUser = authUserRepository.findByWalletAddress(walletAddress);
        if (existingUser.isPresent()) {
            authUserRepository.save(existingUser.get().touch(now));
            return false;
        }

        try {
            authUserRepository.save(new AuthUser(walletAddress, "SOLANA", "ACTIVE", now, now));
            return true;
        } catch (DataIntegrityViolationException ex) {
            AuthUser persistedUser = authUserRepository.findByWalletAddress(walletAddress)
                    .orElseThrow(() -> new IllegalStateException("User insert conflicted but no record was found", ex));
            authUserRepository.save(persistedUser.touch(now));
            return false;
        }
    }
}
