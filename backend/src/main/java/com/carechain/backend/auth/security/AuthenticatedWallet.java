package com.carechain.backend.auth.security;

public record AuthenticatedWallet(
        String walletAddress,
        String walletChain
) {
    public static final String REQUEST_ATTRIBUTE = AuthenticatedWallet.class.getName();
}
