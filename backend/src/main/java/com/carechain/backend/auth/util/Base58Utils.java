package com.carechain.backend.auth.util;

import java.math.BigInteger;
import java.util.Arrays;

public final class Base58Utils {
    private static final char[] ALPHABET =
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".toCharArray();
    private static final int[] INDEXES = new int[128];

    static {
        Arrays.fill(INDEXES, -1);
        for (int i = 0; i < ALPHABET.length; i++) {
            INDEXES[ALPHABET[i]] = i;
        }
    }

    private Base58Utils() {
    }

    public static byte[] decode(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Base58 input is blank");
        }
        BigInteger value = BigInteger.ZERO;
        for (char c : input.toCharArray()) {
            if (c >= INDEXES.length || INDEXES[c] < 0) {
                throw new IllegalArgumentException("Invalid Base58 character");
            }
            value = value.multiply(BigInteger.valueOf(58)).add(BigInteger.valueOf(INDEXES[c]));
        }

        byte[] decoded = value.toByteArray();
        if (decoded.length > 0 && decoded[0] == 0) {
            decoded = Arrays.copyOfRange(decoded, 1, decoded.length);
        }

        int leadingZeros = 0;
        while (leadingZeros < input.length() && input.charAt(leadingZeros) == '1') {
            leadingZeros++;
        }

        byte[] result = new byte[leadingZeros + decoded.length];
        System.arraycopy(decoded, 0, result, leadingZeros, decoded.length);
        return result;
    }

    public static String encode(byte[] input) {
        if (input == null || input.length == 0) {
            return "";
        }
        BigInteger value = new BigInteger(1, input);
        StringBuilder encoded = new StringBuilder();
        while (value.compareTo(BigInteger.ZERO) > 0) {
            BigInteger[] divRem = value.divideAndRemainder(BigInteger.valueOf(58));
            encoded.append(ALPHABET[divRem[1].intValue()]);
            value = divRem[0];
        }
        for (int i = 0; i < input.length && input[i] == 0; i++) {
            encoded.append(ALPHABET[0]);
        }
        return encoded.reverse().toString();
    }
}
