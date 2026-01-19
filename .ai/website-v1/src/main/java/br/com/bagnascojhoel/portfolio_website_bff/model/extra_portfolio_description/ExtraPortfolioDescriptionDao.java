package br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description;

import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubAuthentication;
import br.com.bagnascojhoel.portfolio_website_bff.model.github.GithubUriBuilder;
import br.com.bagnascojhoel.portfolio_website_bff.model.github_repository.GithubRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;


@Slf4j
@Component
public class ExtraPortfolioDescriptionDao {

    private static final String GITHUB_DESCRIPTION_FILE_PATH = "/repos/{username}/{repoName}/contents/{descriptionFileName}";

    private final WebClient webClient;

    private final GithubUriBuilder githubUriBuilder;

    private final ExtraPortfolioDescriptionFactory extraPortfolioDescriptionFactory;

    private final String githubProjectDescriptionFile;

    private final GithubAuthentication githubAuthentication;

    private final String githubUsername;

    public ExtraPortfolioDescriptionDao(
            WebClient webClient,
            GithubAuthentication githubAuthentication,
            GithubUriBuilder githubUriBuilder,
            ExtraPortfolioDescriptionFactory extraPortfolioDescriptionFactory,
            @Value("${project.github.project-description-file}") String githubProjectDescriptionFile,
            @Value("${project.github.username}") String githubUsername) {
        this.webClient = webClient;
        this.githubUriBuilder = githubUriBuilder;
        this.githubAuthentication = githubAuthentication;
        this.extraPortfolioDescriptionFactory = extraPortfolioDescriptionFactory;
        this.githubProjectDescriptionFile = githubProjectDescriptionFile;
        this.githubUsername = githubUsername;
    }

    public Flux<ExtraPortfolioDescription> getExtraPortfolioDescriptions(@NonNull final Collection<GithubRepository> definitions) {
        log.info("asynchronously fetching project description for repository definitions, repo-definitions={}", definitions);
        return Flux.fromIterable(definitions)
                .flatMap(this::callGetPortfolioDescription)
                .cast(GithubDescriptionFile.class)
                .map(extraPortfolioDescriptionFactory::create)
                .filter(Optional::isPresent)
                .map(Optional::get);
    }

    private Mono<GithubDescriptionFile> callGetPortfolioDescription(final GithubRepository definition) {
        var url = githubUriBuilder.withPath(GITHUB_DESCRIPTION_FILE_PATH)
                .build(githubUsername, definition.getRepositoryId().getValue(), githubProjectDescriptionFile);
        var installationToken = githubAuthentication.generateAuthenticationToken();

        return webClient.get()
                .uri(url)
                .header(AUTHORIZATION, "Bearer " + installationToken)
                .exchangeToMono(response -> response.bodyToMono(GithubDescriptionFile.class))
                .map(responseBody -> responseBody.toBuilder().repositoryId(definition.getRepositoryId()).build())
                .onErrorResume(WebClientResponseException.class, this::handleGetProjectDescriptionError)
                .onErrorResume(Throwable.class, this::handleUnknownException);
    }

    private Mono<GithubDescriptionFile> handleGetProjectDescriptionError(final WebClientResponseException webClientResponseException) {
        if (webClientResponseException.getStatusCode().value() == 404) {
            log.info(
                    "could not find project description file on repository, url={}",
                    Objects.requireNonNull(webClientResponseException.getRequest()).getURI());
            return Mono.empty();
        } else {
            log.error("error while getting project description", webClientResponseException);
            return Mono.error(webClientResponseException);
        }
    }

    private Mono<GithubDescriptionFile> handleUnknownException(final Throwable throwable) {
        return Mono.empty();
    }

}
