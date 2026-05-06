package com.carechain.backend.chain.client;

import com.fasterxml.jackson.databind.JsonNode;

public interface HeliusClient {
    JsonNode call(String method, Object params);
}
