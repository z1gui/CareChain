package com.carechain.backend.auth.service;

import com.carechain.backend.auth.util.Base58Utils;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class SolanaSignatureVerifier {
    private static final byte[] ED25519_X509_PREFIX = new byte[]{
            0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00
    };

    public boolean verify(String walletAddress, String message, String signature) {
        try {
            byte[] publicKeyBytes = Base58Utils.decode(walletAddress);
            byte[] x509EncodedKey = new byte[ED25519_X509_PREFIX.length + publicKeyBytes.length];
            System.arraycopy(ED25519_X509_PREFIX, 0, x509EncodedKey, 0, ED25519_X509_PREFIX.length);
            System.arraycopy(publicKeyBytes, 0, x509EncodedKey, ED25519_X509_PREFIX.length, publicKeyBytes.length);

            PublicKey publicKey = KeyFactory.getInstance("Ed25519")
                    .generatePublic(new X509EncodedKeySpec(x509EncodedKey));
            Signature verifier = Signature.getInstance("Ed25519");
            verifier.initVerify(publicKey);
            verifier.update(message.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return verifier.verify(Base64.getDecoder().decode(signature));
        } catch (Exception ex) {
            return false;
        }
    }
}
