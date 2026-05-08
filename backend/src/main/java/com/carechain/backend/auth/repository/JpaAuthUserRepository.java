package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthUser;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JpaAuthUserRepository implements AuthUserRepository {

    private final SpringDataAuthUserJpaRepository jpaRepository;

    public JpaAuthUserRepository(SpringDataAuthUserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<AuthUser> findByWalletAddress(String walletAddress) {
        return jpaRepository.findByWalletAddress(walletAddress)
                .map(this::toModel);
    }

    @Override
    public AuthUser save(AuthUser user) {
        AuthUserEntity entity = jpaRepository.findByWalletAddress(user.walletAddress())
                .orElseGet(AuthUserEntity::new);
        entity.setWalletAddress(user.walletAddress());
        entity.setWalletChain(user.walletChain());
        entity.setStatus(user.status());
        entity.setCreatedAt(user.createdAt());
        entity.setLastLoginAt(user.lastLoginAt());
        return toModel(jpaRepository.saveAndFlush(entity));
    }

    private AuthUser toModel(AuthUserEntity entity) {
        return new AuthUser(
                entity.getWalletAddress(),
                entity.getWalletChain(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getLastLoginAt()
        );
    }
}
