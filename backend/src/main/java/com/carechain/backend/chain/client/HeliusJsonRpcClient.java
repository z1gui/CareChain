package com.carechain.backend.chain.client;

import com.carechain.backend.chain.config.HeliusProperties;
import com.carechain.backend.common.exception.BusinessException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class HeliusJsonRpcClient implements HeliusClient {
    private static final String JSON_RPC_VERSION = "2.0";
    private static final String REQUEST_ID = "carechain";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final HeliusProperties properties;

    public HeliusJsonRpcClient(RestTemplate heliusRestTemplate, ObjectMapper objectMapper, HeliusProperties properties) {
        this.restTemplate = heliusRestTemplate;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    @Override
    public JsonNode call(String method, Object params) {
        assertConfigured();

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("jsonrpc", JSON_RPC_VERSION);
        request.put("id", REQUEST_ID);
        request.put("method", method);
        request.put("params", params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            JsonNode response = restTemplate.postForObject(endpoint(), entity, JsonNode.class);
            if (response == null) {
                throw heliusException("Helius returned an empty response", "HELIUS_EMPTY_RESPONSE", "", HttpStatus.BAD_GATEWAY);
            }
            if (response.hasNonNull("error")) {
                throw heliusException("Helius RPC error", "HELIUS_RPC_ERROR", response.path("error").toString(), HttpStatus.BAD_GATEWAY);
            }
            return response.path("result");
        } catch (BusinessException ex) {
            throw ex;
        } catch (HttpStatusCodeException ex) {
            throw mapStatusException(ex);
        } catch (ResourceAccessException ex) {
            throw heliusException("Helius request timed out or failed", "HELIUS_TIMEOUT", ex.getMessage(), HttpStatus.GATEWAY_TIMEOUT);
        } catch (RestClientException ex) {
            throw heliusException("Helius request failed", "HELIUS_UNAVAILABLE", ex.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    private void assertConfigured() {
        if (properties.getApiKey() == null || properties.getApiKey().isBlank()) {
            throw heliusException("Helius API key is not configured", "HELIUS_API_KEY_MISSING",
                    "Set HELIUS_API_KEY before calling chain data endpoints.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private URI endpoint() {
        return UriComponentsBuilder.fromHttpUrl(properties.getBaseUrl())
                .queryParam("api-key", properties.getApiKey())
                .build()
                .toUri();
    }

    private BusinessException mapStatusException(HttpStatusCodeException ex) {
        HttpStatus status = ex.getStatusCode();
        if (status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN) {
            return heliusException("Helius authorization failed", "HELIUS_UNAUTHORIZED", ex.getResponseBodyAsString(), status);
        }
        if (status == HttpStatus.TOO_MANY_REQUESTS) {
            return heliusException("Helius rate limit exceeded", "HELIUS_RATE_LIMITED", ex.getResponseBodyAsString(), status);
        }
        if (status.is5xxServerError()) {
            return heliusException("Helius service is unavailable", "HELIUS_UNAVAILABLE", ex.getResponseBodyAsString(), HttpStatus.BAD_GATEWAY);
        }
        return heliusException("Helius request failed", "HELIUS_REQUEST_FAILED", ex.getResponseBodyAsString(), status);
    }

    private BusinessException heliusException(String message, String code, String details, HttpStatus status) {
        JsonNode detailsNode = details == null || details.isBlank()
                ? objectMapper.createObjectNode()
                : objectMapper.getNodeFactory().textNode(details);
        return new BusinessException(message, code, detailsNode.toString(), status);
    }
}
