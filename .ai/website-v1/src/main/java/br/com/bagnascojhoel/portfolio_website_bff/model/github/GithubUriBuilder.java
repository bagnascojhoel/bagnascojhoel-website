package br.com.bagnascojhoel.portfolio_website_bff.model.github;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Objects;

@Component
public class GithubUriBuilder {
    private final String host;
    private final String port;
    private final String scheme;

    public GithubUriBuilder(
            @Value("${project.github.host}") String host,
            @Value("${project.github.scheme}") String scheme,
            @Value("${project.github.port:#{null}}") String port
    ) {
        this.host = host;
        this.scheme = scheme;
        this.port = port;
    }

    public UriBuilder withPath(String path) {
        Assert.notNull(host, "github host cannot be null");

        return UriComponentsBuilder.newInstance()
                .host(host)
                .scheme(Objects.requireNonNullElse(scheme, "https"))
                .port(port)
                .path(path);

    }
}
