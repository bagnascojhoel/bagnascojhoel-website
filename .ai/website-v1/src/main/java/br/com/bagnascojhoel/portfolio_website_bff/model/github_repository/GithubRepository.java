package br.com.bagnascojhoel.portfolio_website_bff.model.github_repository;

import br.com.bagnascojhoel.portfolio_website_bff.model.RepositoryId;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.annotation.Nullable;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.util.Set;


@JsonDeserialize(builder = GithubRepository.GithubRepositoryBuilder.class)
@Builder
@Getter
public final class GithubRepository {
    @NonNull
    @JsonProperty("name")
    private final RepositoryId repositoryId;

    @NonNull
    @JsonProperty("html_url")
    private final String htmlUrl;

    @Nullable
    @JsonProperty("homepage")
    private final String websiteUrl;

    @NonNull
    @JsonProperty("archived")
    private final Boolean isArchived;

    @Nullable
    @JsonProperty("description")
    private final String description;

    @Nullable
    @JsonProperty("topics")
    private final Set<String> topics;

    @NonNull
    @JsonProperty("pushed_at")
    private final LocalDateTime pushedAt;
}
