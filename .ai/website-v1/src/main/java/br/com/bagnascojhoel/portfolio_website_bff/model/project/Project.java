package br.com.bagnascojhoel.portfolio_website_bff.model.project;

import br.com.bagnascojhoel.portfolio_website_bff.model.extra_portfolio_description.Complexity;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Builder
@AllArgsConstructor
@Getter
@Data
public class Project {
    @NonNull
    @JsonProperty("uniqueName")
    private String repositoryId;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @NonNull
    private Set<String> tags;

    @NonNull
    private String repositoryUrl;

    @Nullable
    private String websiteUrl;

    @NonNull
    private Boolean startsOpen;

    @NonNull
    private Complexity complexity;

    @NonNull
    private Instant lastChangedDateTime;

    @JsonGetter("repositoryId")
    public String getRepositoryId() {
        return repositoryId;
    }
}
