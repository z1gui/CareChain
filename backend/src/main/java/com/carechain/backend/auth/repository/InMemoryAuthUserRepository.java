package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthUser;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class InMemoryAuthUserRepository implements AuthUserRepository {

    private final ConcurrentMap<String, AuthUser> users = new ConcurrentHashMap<>();

    @Override
    public Optional<AuthUser> findByWalletAddress(String walletAddress) {
        return Optional.ofNullable(users.get(walletAddress));
    }

    @Override
    public AuthUser save(AuthUser user) {
        users.put(user.walletAddress(), user);
        return user;
    }
}
