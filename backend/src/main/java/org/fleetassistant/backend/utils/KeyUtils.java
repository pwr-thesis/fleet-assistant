package org.fleetassistant.backend.utils;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.exceptionhandler.nonrest.KeyPairCreationException;
import org.fleetassistant.backend.exceptionhandler.nonrest.KeyPairNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Objects;

import static org.fleetassistant.backend.utils.Constants.*;

@Component
@RequiredArgsConstructor
public class KeyUtils {
    private final Environment environment;

    @Value("${access-token.private}")
    private String accessTokenPrivateKeyPath;
    @Value("${access-token.public}")
    private String accessTokenPublicKeyPath;
    @Value("${refresh-token.private}")
    private String refreshTokenPrivateKeyPath;
    @Value("${refresh-token.public}")
    private String refreshTokenPublicKeyPath;
    private KeyPair accessTokenKeyPair;
    private KeyPair refreshTokenKeyPair;

    public KeyPair getAccessTokenKeyPair() {
        if (Objects.isNull(accessTokenKeyPair)) {
            accessTokenKeyPair = getKeyPair(accessTokenPrivateKeyPath, accessTokenPublicKeyPath);
        }

        return accessTokenKeyPair;
    }

    public KeyPair getRefreshTokenKeyPair() {
        if (Objects.isNull(refreshTokenKeyPair)) {
            refreshTokenKeyPair = getKeyPair(refreshTokenPrivateKeyPath, refreshTokenPublicKeyPath);
        }

        return refreshTokenKeyPair;
    }

    private KeyPair getKeyPair(String tokenPrivateKeyPath, String tokenPublicKeyPath) {
        KeyPair keyPair;
        KeyFactory keyFactory;

        File publicKeyFile = new File(tokenPublicKeyPath);
        File privateKeyFile = new File(tokenPrivateKeyPath);
        if (publicKeyFile.exists() && privateKeyFile.exists()) {
            try {

                keyFactory = KeyFactory.getInstance("RSA");
                byte[] publicKeyBytes = Files.readAllBytes(publicKeyFile.toPath());
                EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
                PublicKey publicKey = keyFactory.generatePublic(publicKeySpec);


                byte[] privateKeyBytes = Files.readAllBytes(privateKeyFile.toPath());
                PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
                PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

                keyPair = new KeyPair(publicKey, privateKey);
                return keyPair;
            } catch (NoSuchAlgorithmException | IOException | InvalidKeySpecException e) {
                throw new KeyPairCreationException(ERROR_LOADING_KEYS);
            }
        } else {
            if (Arrays.asList(environment.getActiveProfiles()).contains(DEFAULT_PROFILE)) {
                throw new KeyPairNotFoundException(KEYS_DON_T_EXIST);
            }
        }
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");

            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
            try (FileOutputStream fos = new FileOutputStream(tokenPublicKeyPath)) {
                X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyPair.getPublic().getEncoded());
                fos.write(keySpec.getEncoded());
            }
            try (FileOutputStream fos = new FileOutputStream(tokenPrivateKeyPath)) {
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyPair.getPrivate().getEncoded());
                fos.write(keySpec.getEncoded());
            }
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new KeyPairCreationException(ERROR_CREATING_KEYS);
        }
        return keyPair;

    }

    public RSAPrivateKey getAccessTokenPrivateKey() {
        return (RSAPrivateKey) getAccessTokenKeyPair().getPrivate();
    }

    public RSAPublicKey getAccessTokenPublicKey() {
        return (RSAPublicKey) getAccessTokenKeyPair().getPublic();
    }

    public RSAPrivateKey getRefreshTokenPrivateKey() {
        return (RSAPrivateKey) getRefreshTokenKeyPair().getPrivate();
    }

    public RSAPublicKey getRefreshTokenPublicKey() {
        return (RSAPublicKey) getRefreshTokenKeyPair().getPublic();
    }
}