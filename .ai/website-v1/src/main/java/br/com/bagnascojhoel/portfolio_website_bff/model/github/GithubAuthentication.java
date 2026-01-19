package br.com.bagnascojhoel.portfolio_website_bff.model.github;

import br.com.bagnascojhoel.portfolio_website_bff.model.UnrecoverableError;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Objects;

@Component
@Slf4j
public class GithubAuthentication {
    private static final String MY_APP_INSTALLATION_PATH = "/users/{username}/installation";
    private static final String INSTALLATION_ACCESS_TOKEN_PATH = "/app/installations/{installationId}/access_tokens";

    private final RestTemplate restTemplate;
    private final ResourceLoader resourceLoader;
    private final GithubUriBuilder githubUriBuilder;
    private final String privateKeyResourcePath;
    private final String githubAppId;
    private final String githubUsername;
    private final String privateKeyBase64;

    private String myInstallationId;
    private Algorithm jwtSignAlgorithm;
    private InstallationAccessToken installationAccessToken = InstallationAccessToken.createExpired();

    public GithubAuthentication(
            RestTemplate restTemplate,
            ResourceLoader resourceLoader,
            GithubUriBuilder githubUriBuilder,
            @Value("${project.github.app-id}") String githubAppId,
            @Value("${project.github.username}") String username,
            @Value("${project.github.private-key-resource-path:#{null}}") String privateKeyResourcePath,
            @Value("${project.github.private-key-base-64:#{null}}") String privateKeyBase64) {
        this.restTemplate = restTemplate;
        this.resourceLoader = resourceLoader;
        this.githubUriBuilder = githubUriBuilder;
        this.githubAppId = githubAppId;
        this.githubUsername = username;
        this.privateKeyResourcePath = privateKeyResourcePath;
        this.privateKeyBase64 = privateKeyBase64;
    }

    public String generateAuthenticationToken() {
        if (this.installationAccessToken.hasExpired()) {
            var myInstallationId = getMyInstallationId();
            var url = githubUriBuilder.withPath(INSTALLATION_ACCESS_TOKEN_PATH).build(myInstallationId);
            var requestEntity = RequestEntity.post(url)
                    .header("authorization", "Bearer " + generateJwt())
                    .accept(GithubMediaTypes.GITHUB_JSON)
                    .build();
            var response = restTemplate.exchange(requestEntity, InstallationAccessToken.class);
            this.installationAccessToken = Objects.requireNonNull(response.getBody());
        }
        return this.installationAccessToken.token;
    }

    private String getMyInstallationId() {
        if (this.myInstallationId == null) {
            var url = githubUriBuilder.withPath(MY_APP_INSTALLATION_PATH).build(githubUsername);
            RequestEntity<Void> requestEntity = RequestEntity.get(url)
                    .header("authorization", "Bearer " + generateJwt())
                    .accept(GithubMediaTypes.GITHUB_JSON)
                    .build();
            var response = restTemplate.exchange(requestEntity, UserInstallation.class);
            var responseBody = Objects.requireNonNull(response.getBody());
            this.myInstallationId = responseBody.id;
        }

        return this.myInstallationId;
    }

    private String generateJwt() {
        return JWT.create()
                .withIssuer(githubAppId)
                .withIssuedAt(Instant.now().minusSeconds(30))
                .withExpiresAt(Instant.now().plus(1, ChronoUnit.MINUTES))
                .sign(this.getJwtSignAlgorithm());
    }

    private Algorithm getJwtSignAlgorithm() {
        if (this.jwtSignAlgorithm == null) {
            this.jwtSignAlgorithm = Algorithm.RSA256(this.getRSA256PrivateKey());
        }
        return this.jwtSignAlgorithm;
    }

    private RSAPrivateKey getRSA256PrivateKey() {
        var keyFactory = getRSAFactory();

        byte[] encodedKey;
        if (privateKeyBase64 != null) {
            encodedKey = Base64.getDecoder().decode(privateKeyBase64);
        } else if (privateKeyResourcePath != null) {
            encodedKey = getPrivateKeyFileContent();
        } else {
            throw new IllegalStateException("there is no way to get encryption key");
        }

        KeySpec keySpec = new PKCS8EncodedKeySpec(encodedKey);
        RSAPrivateKey privateKey;
        try {
            privateKey = (RSAPrivateKey) keyFactory.generatePrivate(keySpec);
        } catch (InvalidKeySpecException invalidKeySpecException) {
            log.error("key specification could not be used to generate github's private key");
            throw new UnrecoverableError(invalidKeySpecException);
        }
        return privateKey;
    }

    private byte[] getPrivateKeyFileContent() {
        try {
            return resourceLoader.getResource(privateKeyResourcePath).getContentAsByteArray();
        } catch (IOException ioException) {
            log.error("could not read github private key", ioException);
            throw new UnrecoverableError(ioException);
        }

    }

    private KeyFactory getRSAFactory() {
        try {
            return KeyFactory.getInstance("RSA");
        } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
            log.error("could not get key factory instance for GitHub token");
            throw new UnrecoverableError(noSuchAlgorithmException);
        }
    }

    @Data
    public static class UserInstallation {
        private String id;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InstallationAccessToken {
        @Nullable
        private String token;
        @JsonProperty("expires_at")
        private Instant expiresAt;

        public static InstallationAccessToken createExpired() {
            return new InstallationAccessToken(null, Instant.MIN);
        }

        public boolean hasExpired() {
            return !expiresAt.isAfter(Instant.now().plusSeconds(60));
        }
    }
}
