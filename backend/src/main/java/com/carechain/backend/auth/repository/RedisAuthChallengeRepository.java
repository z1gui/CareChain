package com.carechain.backend.auth.repository;

import com.carechain.backend.auth.model.AuthChallenge;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Collections;
import java.util.Optional;

@Repository
public class RedisAuthChallengeRepository implements AuthChallengeRepository {
    private static final String KEY_PREFIX = "auth:challenge:";
    private static final DefaultRedisScript<Long> MARK_USED_SCRIPT = new DefaultRedisScript<>(
            "local value = redis.call('GET', KEYS[1]) "
                    + "if not value then return 0 end "
                    + "local updated = cjson.decode(value) "
                    + "if updated.status ~= 'PENDING' then return 0 end "
                    + "updated.status = 'USED' "
                    + "redis.call('SET', KEYS[1], cjson.encode(updated), 'KEEPTTL') "
                    + "return 1",
            Long.class
    );

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public RedisAuthChallengeRepository(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void save(AuthChallenge challenge, Duration ttl) {
        redisTemplate.opsForValue().set(key(challenge.challengeId()), writeValue(challenge), ttl);
    }

    @Override
    public Optional<AuthChallenge> findById(String challengeId) {
        String value = redisTemplate.opsForValue().get(key(challengeId));
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(readValue(value));
    }

    @Override
    public boolean markUsed(String challengeId) {
        Long updated = redisTemplate.execute(MARK_USED_SCRIPT, Collections.singletonList(key(challengeId)));
        return updated != null && updated == 1L;
    }

    @Override
    public void delete(String challengeId) {
        redisTemplate.delete(key(challengeId));
    }

    private String key(String challengeId) {
        return KEY_PREFIX + challengeId;
    }

    private String writeValue(AuthChallenge challenge) {
        try {
            return objectMapper.writeValueAsString(challenge);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize auth challenge", ex);
        }
    }

    private AuthChallenge readValue(String value) {
        try {
            return objectMapper.readValue(value, AuthChallenge.class);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to deserialize auth challenge", ex);
        }
    }
}
