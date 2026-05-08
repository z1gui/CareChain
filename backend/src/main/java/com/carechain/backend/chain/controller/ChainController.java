package com.carechain.backend.chain.controller;

import com.carechain.backend.chain.service.ChainOperation;
import com.carechain.backend.chain.service.ChainQueryService;
import com.carechain.backend.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chain")
public class ChainController {

    private final ChainQueryService chainQueryService;

    public ChainController(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    @GetMapping("/history")
    public ApiResponse<List<ChainOperation>> getHistory(
            @RequestParam String walletAddress,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ApiResponse.ok(chainQueryService.getHistory(walletAddress, limit));
    }
}
