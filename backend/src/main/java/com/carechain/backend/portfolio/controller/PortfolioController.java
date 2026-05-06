package com.carechain.backend.portfolio.controller;

import com.carechain.backend.chain.service.NftHolding;
import com.carechain.backend.chain.service.WalletAssets;
import com.carechain.backend.chain.service.YieldSummary;
import com.carechain.backend.common.api.ApiResponse;
import com.carechain.backend.portfolio.service.PortfolioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio/summary")
    public ApiResponse<Map<String, Object>> getSummary() {
        return ApiResponse.ok(portfolioService.getSummary());
    }

    @GetMapping("/portfolio/yield-trend")
    public ApiResponse<Map<String, Object>> getYieldTrend(@RequestParam(defaultValue = "6m") String range) {
        return ApiResponse.ok(portfolioService.getYieldTrend(range));
    }

    @GetMapping("/nft-holdings")
    public ApiResponse<List<Map<String, Object>>> getHoldings() {
        return ApiResponse.ok(portfolioService.getHoldings());
    }

    @GetMapping("/portfolio/assets")
    public ApiResponse<WalletAssets> getWalletAssets(@RequestParam String walletAddress) {
        return ApiResponse.ok(portfolioService.getWalletAssets(walletAddress));
    }

    @GetMapping("/portfolio/yield")
    public ApiResponse<YieldSummary> getWalletYield(@RequestParam String walletAddress) {
        return ApiResponse.ok(portfolioService.getWalletYield(walletAddress));
    }

    @GetMapping("/portfolio/nfts")
    public ApiResponse<List<NftHolding>> getWalletNfts(@RequestParam String walletAddress) {
        return ApiResponse.ok(portfolioService.getWalletNfts(walletAddress));
    }
}
