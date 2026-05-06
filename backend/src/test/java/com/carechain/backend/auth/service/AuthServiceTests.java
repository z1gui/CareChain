package com.carechain.backend.auth.service;

import com.carechain.backend.auth.config.AuthProperties;
import com.carechain.backend.auth.model.AuthChallenge;
import com.carechain.backend.auth.repository.AuthChallengeRepository;
import com.carechain.backend.auth.repository.InMemoryAuthUserRepository;
import com.carechain.backend.auth.security.AuthenticatedWallet;
import com.carechain.backend.common.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.security.interfaces.EdECPublicKey;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthServiceTests {

    private AuthService authService;

    @BeforeEach
    void setUp() {
        AuthProperties authProperties = new AuthProperties();
        authProperties.setJwtSecret("0123456789abcdef0123456789abcdef");
        authService = new AuthService(
                authProperties,
                new InMemoryChallengeRepository(),
                new InMemoryAuthUserRepository(),
                new SolanaSignatureVerifier(),
                new JwtTokenService(authProperties, new com.fasterxml.jackson.databind.ObjectMapper())
        );
    }

    @Test
    void createChallengeStoresPendingChallenge() {
        Map<String, Object> response = authService.createChallenge(walletAddressForNewKey());

        assertNotNull(response.get("challengeId"));
        assertNotNull(response.get("nonce"));
        assertNotNull(response.get("message"));
        assertNotNull(response.get("expiredAt"));
    }

    @Test
    void verifyAcceptsValidSolanaSignatureAndReturnsJwt() throws Exception {
        KeyPair keyPair = KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
        String walletAddress = toSolanaAddress((EdECPublicKey) keyPair.getPublic());
        Map<String, Object> challenge = authService.createChallenge(walletAddress);
        String message = (String) challenge.get("message");
        String signature = sign(keyPair, message);

        Map<String, Object> response = authService.verify(
                (String) challenge.get("challengeId"),
                walletAddress,
                signature,
                message
        );

        assertEquals(walletAddress, response.get("walletAddress"));
        assertEquals("SOLANA", response.get("walletChain"));
        assertFalse(response.get("accessToken").toString().isBlank());
        assertTrue((Boolean) response.get("isNewUser"));
    }

    @Test
    void verifyRejectsReplayOfUsedChallenge() throws Exception {
        KeyPair keyPair = KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
        String walletAddress = toSolanaAddress((EdECPublicKey) keyPair.getPublic());
        Map<String, Object> challenge = authService.createChallenge(walletAddress);
        String message = (String) challenge.get("message");
        String signature = sign(keyPair, message);

        authService.verify((String) challenge.get("challengeId"), walletAddress, signature, message);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> authService.verify((String) challenge.get("challengeId"), walletAddress, signature, message)
        );
        assertEquals("AUTH_CHALLENGE_USED", exception.getCode());
    }

    @Test
    void currentUserReturnsPersistedWalletData() throws Exception {
        KeyPair keyPair = KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
        String walletAddress = toSolanaAddress((EdECPublicKey) keyPair.getPublic());
        Map<String, Object> challenge = authService.createChallenge(walletAddress);
        String message = (String) challenge.get("message");
        String signature = sign(keyPair, message);

        authService.verify((String) challenge.get("challengeId"), walletAddress, signature, message);

        Map<String, Object> currentUser = authService.currentUser(new AuthenticatedWallet(walletAddress, "SOLANA"));
        assertEquals(walletAddress, currentUser.get("walletAddress"));
        assertEquals("SOLANA", currentUser.get("walletChain"));
    }

    private String walletAddressForNewKey() {
        try {
            KeyPair keyPair = KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
            return toSolanaAddress((EdECPublicKey) keyPair.getPublic());
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }

    private String sign(KeyPair keyPair, String message) throws Exception {
        Signature signature = Signature.getInstance("Ed25519");
        signature.initSign(keyPair.getPrivate());
        signature.update(message.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(signature.sign());
    }

    private String toSolanaAddress(EdECPublicKey publicKey) {
        byte[] y = publicKey.getPoint().getY().toByteArray();
        byte[] raw = new byte[32];
        byte[] positiveY = y.length > 32 ? java.util.Arrays.copyOfRange(y, y.length - 32, y.length) : y;
        System.arraycopy(positiveY, 0, raw, 32 - positiveY.length, positiveY.length);
        reverse(raw);
        if (publicKey.getPoint().isXOdd()) {
            raw[31] |= (byte) 0x80;
        }
        return com.carechain.backend.auth.util.Base58Utils.encode(raw);
    }

    private void reverse(byte[] value) {
        for (int i = 0; i < value.length / 2; i++) {
            byte tmp = value[i];
            value[i] = value[value.length - 1 - i];
            value[value.length - 1 - i] = tmp;
        }
    }

    private static class InMemoryChallengeRepository implements AuthChallengeRepository {
        private final ConcurrentMap<String, AuthChallenge> values = new ConcurrentHashMap<>();

        @Override
        public void save(AuthChallenge challenge, Duration ttl) {
            values.put(challenge.challengeId(), challenge);
        }

        @Override
        public Optional<AuthChallenge> findById(String challengeId) {
            return Optional.ofNullable(values.get(challengeId));
        }

        @Override
        public boolean markUsed(String challengeId) {
            AuthChallenge updated = values.computeIfPresent(challengeId, (key, value) -> {
                if (!"PENDING".equals(value.status())) {
                    return value;
                }
                return value.markUsed();
            });
            return updated != null && "USED".equals(updated.status());
        }

        @Override
        public void delete(String challengeId) {
            values.remove(challengeId);
        }
    }
}
