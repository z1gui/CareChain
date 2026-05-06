package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthUser;

import java.util.Optional;

public interface AuthUserRepository {

    Optional<AuthUser> findByWalletAddress(String walletAddress);

    AuthUser save(AuthUser user);
}
