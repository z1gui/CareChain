package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@ActiveProfiles("test")
@Import(JpaAuthUserRepository.class)
class JpaAuthUserRepositoryTests {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Test
    void saveAndFindByWalletAddressPersistUser() {
        OffsetDateTime now = OffsetDateTime.parse("2026-04-15T00:00:00Z");
        AuthUser authUser = new AuthUser("wallet_123", "SOLANA", "ACTIVE", now, now);

        AuthUser saved = authUserRepository.save(authUser);

        assertNotNull(saved);
        assertTrue(authUserRepository.findByWalletAddress("wallet_123").isPresent());
        assertEquals("SOLANA", authUserRepository.findByWalletAddress("wallet_123").orElseThrow().walletChain());
    }
}
