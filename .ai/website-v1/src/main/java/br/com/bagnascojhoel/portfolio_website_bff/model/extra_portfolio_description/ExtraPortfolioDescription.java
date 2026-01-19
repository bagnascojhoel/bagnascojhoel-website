package br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description;

import br.com.bagnascojhoel.portfolio_website_bff.model.RepositoryId;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

import java.util.Set;

@Data
@Builder(toBuilder = true)
public class ExtraPortfolioDescription {
    private final RepositoryId repositoryId;

    @NonNull
    private final String title;

    @Nullable
    @JsonProperty("description")
    private final String customDescription;

    @Nullable
    @JsonAlias("tags")
    private final Set<String> customTopics;

    @Nullable
    private final String websiteUrl;

    @Nullable
    private final Complexity complexity;

    @Nullable
    private final Boolean startsOpen;

    @Nullable
    private final Boolean showEvenArchived;
}
