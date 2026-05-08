package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthChallenge;

import java.time.Duration;
import java.util.Optional;

public interface AuthChallengeRepository {

    void save(AuthChallenge challenge, Duration ttl);

    Optional<AuthChallenge> findById(String challengeId);

    boolean markUsed(String challengeId);

    void delete(String challengeId);
}
