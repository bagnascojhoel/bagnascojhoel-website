package br.com.bagnascojhoel.portfolio_website_bff.model.github_repository;

import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubAuthentication;
import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubQueryParams;
import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubUriBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Component
public class GithubRepositoryDao {
    private static final String GITHUB_REPOSITORIES_PATH = "/users/{username}/repos";

    private final RestTemplate restTemplate;
    private final GithubUriBuilder githubUriBuilder;
    private final GithubAuthentication githubAuthentication;

    private final String githubUsername;

    public GithubRepositoryDao(
            final RestTemplate restTemplate,
            final GithubAuthentication githubAuthentication,
            final GithubUriBuilder githubUriBuilder,
            @Value("${project.github.username}") final String githubUsername) {
        this.restTemplate = restTemplate;
        this.githubUriBuilder = githubUriBuilder;
        this.githubAuthentication = githubAuthentication;
        this.githubUsername = githubUsername;
    }

    public List<GithubRepository> getGithubRepositories(Integer limit) {
        var url = githubUriBuilder.withPath(GITHUB_REPOSITORIES_PATH)
                .queryParam(GithubQueryParams.PER_PAGE, limit)
                .queryParam(GithubQueryParams.SORT, "pushed")
                .queryParam(GithubQueryParams.DIRECTION, "desc")
                .build(githubUsername);
        var installationToken = githubAuthentication.generateAuthenticationToken();
        var requestEntity = RequestEntity.get(url)
                .header(AUTHORIZATION, "Bearer " + installationToken)
                .build();

        var response = restTemplate.exchange(requestEntity, GithubRepository[].class);
        return Arrays.stream(Objects.requireNonNull(response.getBody()))
                .collect(Collectors.toList());
    }
}
