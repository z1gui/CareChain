package com.carechain.backend.chain.client;

import com.carechain.backend.chain.config.HeliusProperties;
import com.carechain.backend.common.exception.BusinessException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class HeliusJsonRpcClientTests {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void callPostsJsonRpcRequestWithApiKey() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        HeliusProperties properties = new HeliusProperties();
        properties.setBaseUrl("https://mainnet.helius-rpc.com");
        properties.setApiKey("test-key");
        HeliusJsonRpcClient client = new HeliusJsonRpcClient(restTemplate, objectMapper, properties);

        server.expect(once(), requestTo("https://mainnet.helius-rpc.com?api-key=test-key"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {
                          "jsonrpc": "2.0",
                          "id": "carechain",
                          "method": "getAssetsByOwner",
                          "params": {
                            "ownerAddress": "wallet-1",
                            "page": 1,
                            "limit": 100
                          }
                        }
                        """))
                .andRespond(withSuccess("""
                        {
                          "jsonrpc": "2.0",
                          "result": {
                            "total": 0,
                            "items": []
                          }
                        }
                        """, MediaType.APPLICATION_JSON));

        JsonNode result = client.call("getAssetsByOwner", Map.of(
                "ownerAddress", "wallet-1",
                "page", 1,
                "limit", 100
        ));

        assertThat(result.path("items").isArray()).isTrue();
        server.verify();
    }

    @Test
    void callFailsFastWhenApiKeyIsBlank() {
        HeliusProperties properties = new HeliusProperties();
        properties.setApiKey(" ");
        HeliusJsonRpcClient client = new HeliusJsonRpcClient(new RestTemplate(), objectMapper, properties);

        assertThatThrownBy(() -> client.call("getAssetsByOwner", Map.of()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Helius API key is not configured")
                .extracting("code")
                .isEqualTo("HELIUS_API_KEY_MISSING");
    }
}
