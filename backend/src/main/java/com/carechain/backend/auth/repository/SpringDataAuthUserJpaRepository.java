package com.carechain.backend.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataAuthUserJpaRepository extends JpaRepository<AuthUserEntity, Long> {

    Optional<AuthUserEntity> findByWalletAddress(String walletAddress);
}
