package br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description;

import br.com.bagnascojhoel.portfolio_website_bff.model.RepositoryId;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Setter
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor
public final class GithubDescriptionFile {
    @NonNull
    private final String rawContent;
    private final RepositoryId repositoryId;

    @JsonCreator
    public GithubDescriptionFile(@JsonProperty("content") final String content) {
        this.rawContent = content;
        this.repositoryId = null;
    }
}
